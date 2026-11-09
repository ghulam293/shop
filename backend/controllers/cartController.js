import { query } from '../config/db.js';

// Helper to get or create a cart for a user
async function getUserCartId(userId) {
  const carts = await query('SELECT id FROM carts WHERE user_id = ?', [userId]);
  if (carts.length > 0) {
    return carts[0].id;
  }
  const result = await query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
  return result.insertId;
}

export async function getCart(req, res, next) {
  try {
    const userId = req.user.id;
    const cartId = await getUserCartId(userId);

    const items = await query(
      `SELECT ci.id, ci.cart_id, ci.variant_id, ci.quantity, ci.student_id,
              pv.sku AS variant_sku, pv.size, COALESCE(pv.price_override, p.base_price) AS unit_price,
              p.id AS product_id, p.name_en, p.name_ar, p.sku AS product_sku,
              pi.image_url,
              COALESCE(inv.stock_quantity - inv.reserved_quantity, 0) AS available_stock,
              s.full_name AS student_name, s.grade AS student_grade
       FROM cart_items ci
       JOIN product_variants pv ON ci.variant_id = pv.id
       JOIN products p ON pv.product_id = p.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
       LEFT JOIN inventory inv ON pv.id = inv.variant_id
       LEFT JOIN students s ON ci.student_id = s.id
       WHERE ci.cart_id = ?
       ORDER BY ci.created_at ASC`,
      [cartId]
    );

    let subtotal = 0;
    const formattedItems = items.map(item => {
      const price = parseFloat(item.unit_price);
      const itemSubtotal = price * item.quantity;
      subtotal += itemSubtotal;
      return {
        ...item,
        unit_price: price.toFixed(3),
        subtotal: itemSubtotal.toFixed(3),
        in_stock: item.available_stock >= item.quantity
      };
    });

    const shippingFee = 0.000; // Free school pickup standard
    const total = subtotal + shippingFee;

    res.json({
      success: true,
      cart: {
        id: cartId,
        items: formattedItems,
        itemCount: formattedItems.reduce((acc, curr) => acc + curr.quantity, 0),
        subtotal: subtotal.toFixed(3),
        shippingFee: shippingFee.toFixed(3),
        total: total.toFixed(3),
        currency: 'OMR'
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function addToCart(req, res, next) {
  try {
    const userId = req.user.id;
    const { variantId, quantity = 1, studentId = null } = req.body;

    if (!variantId) {
      return res.status(400).json({
        success: false,
        message: 'Product variant (size) must be specified.'
      });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quantity.'
      });
    }

    // Verify variant and check inventory stock
    const variants = await query(
      `SELECT pv.id, pv.product_id, COALESCE(inv.stock_quantity - inv.reserved_quantity, 0) AS available_stock
       FROM product_variants pv
       LEFT JOIN inventory inv ON pv.id = inv.variant_id
       WHERE pv.id = ?`,
      [variantId]
    );

    if (variants.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Selected product variant was not found.'
      });
    }

    const availableStock = variants[0].available_stock;
    const cartId = await getUserCartId(userId);

    // Check if item already in cart
    const existing = await query(
      `SELECT id, quantity FROM cart_items
       WHERE cart_id = ? AND variant_id = ? AND (student_id = ? OR (student_id IS NULL AND ? IS NULL))`,
      [cartId, variantId, studentId, studentId]
    );

    const currentQtyInCart = existing.length > 0 ? existing[0].quantity : 0;
    const newTotalQty = currentQtyInCart + qty;

    if (newTotalQty > availableStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableStock} unit(s) available in stock. You already have ${currentQtyInCart} in your cart.`
      });
    }

    if (existing.length > 0) {
      await query(
        'UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newTotalQty, existing[0].id]
      );
    } else {
      await query(
        'INSERT INTO cart_items (cart_id, variant_id, quantity, student_id) VALUES (?, ?, ?, ?)',
        [cartId, variantId, qty, studentId]
      );
    }

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
}

export async function updateCartItem(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a non-negative number.'
      });
    }

    const cartId = await getUserCartId(userId);

    if (qty === 0) {
      await query('DELETE FROM cart_items WHERE id = ? AND cart_id = ?', [id, cartId]);
      return getCart(req, res, next);
    }

    // Check stock
    const items = await query(
      `SELECT ci.id, ci.variant_id, COALESCE(inv.stock_quantity - inv.reserved_quantity, 0) as available_stock
       FROM cart_items ci
       LEFT JOIN inventory inv ON ci.variant_id = inv.variant_id
       WHERE ci.id = ? AND ci.cart_id = ?`,
      [id, cartId]
    );

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found.'
      });
    }

    if (qty > items[0].available_stock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds available stock (${items[0].available_stock} available).`
      });
    }

    await query('UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [qty, id]);

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
}

export async function removeCartItem(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const cartId = await getUserCartId(userId);

    await query('DELETE FROM cart_items WHERE id = ? AND cart_id = ?', [id, cartId]);

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
}

