import { query, transaction } from '../config/db.js';

export async function createOrder(req, res, next) {
  try {
    const userId = req.user.id;
    const {
      fulfillmentMethod = 'SCHOOL_PICKUP',
      shippingAddressId = null,
      paymentMethod = 'SCHOOL_COUNTER_CASH',
      notes = ''
    } = req.body;

    // Validate fulfillment method
    const validFulfillment = ['SCHOOL_PICKUP', 'DELIVERY'];
    if (!validFulfillment.includes(fulfillmentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid fulfillment method.'
      });
    }

    // Process order inside atomic transaction
    const orderResult = await transaction(async (conn) => {
      // 1. Get user cart items
      const [cartRows] = await conn.execute(
        'SELECT id FROM carts WHERE user_id = ?',
        [userId]
      );

      if (cartRows.length === 0) {
        throw { statusCode: 400, isOperational: true, message: 'Your cart is empty.' };
      }

      const cartId = cartRows[0].id;

      const [cartItems] = await conn.execute(
        `SELECT ci.id, ci.variant_id, ci.quantity, ci.student_id,
                pv.size, COALESCE(pv.price_override, p.base_price) AS unit_price,
                p.id AS product_id, p.name_en, p.name_ar,
                inv.stock_quantity, inv.reserved_quantity
         FROM cart_items ci
         JOIN product_variants pv ON ci.variant_id = pv.id
         JOIN products p ON pv.product_id = p.id
         JOIN inventory inv ON pv.id = inv.variant_id
         WHERE ci.cart_id = ?
         FOR UPDATE`, // Lock inventory rows
        [cartId]
      );

      if (cartItems.length === 0) {
        throw { statusCode: 400, isOperational: true, message: 'Your cart is empty. Please add items before checking out.' };
      }

      // 2. Validate stock availability and calculate subtotal
      let subtotal = 0;
      for (const item of cartItems) {
        const available = item.stock_quantity - item.reserved_quantity;
        if (item.quantity > available) {
          throw {
            statusCode: 400,
            isOperational: true,
            message: `Insufficient stock for "${item.name_en}" (Size: ${item.size}). Only ${available} available.`
          };
        }
        subtotal += parseFloat(item.unit_price) * item.quantity;
      }

      const shippingFee = fulfillmentMethod === 'DELIVERY' ? 2.000 : 0.000;
      const totalAmount = subtotal + shippingFee;

      // 3. Generate unique order number
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const orderNumber = `IPS-2026-${randomSuffix}`;

      // 4. Create order record
      const [orderRes] = await conn.execute(
        `INSERT INTO orders (
          order_number, user_id, fulfillment_method, shipping_address_id,
          pickup_campus, status, subtotal, discount_amount, shipping_fee, total_amount, notes
        ) VALUES (?, ?, ?, ?, 'Store Main Collection', 'PENDING', ?, 0.000, ?, ?, ?)`,
        [orderNumber, userId, fulfillmentMethod, shippingAddressId, subtotal, shippingFee, totalAmount, notes]
      );
      const orderId = orderRes.insertId;

      // 5. Insert order items & deduct inventory stock
      for (const item of cartItems) {
        const itemSubtotal = parseFloat(item.unit_price) * item.quantity;
        await conn.execute(
          `INSERT INTO order_items (
            order_id, variant_id, student_id, product_name_en, product_name_ar, size, unit_price, quantity, subtotal
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId, item.variant_id, item.student_id, item.name_en, item.name_ar,
            item.size, item.unit_price, item.quantity, itemSubtotal
          ]
        );

        // Deduct stock from inventory
        await conn.execute(
          `UPDATE inventory
           SET stock_quantity = stock_quantity - ?, updated_at = CURRENT_TIMESTAMP
           WHERE variant_id = ?`,
          [item.quantity, item.variant_id]
        );
      }

      // 6. Record initial payment record
      await conn.execute(
        `INSERT INTO payments (
          order_id, payment_method, amount, currency, status
        ) VALUES (?, ?, ?, 'OMR', ?)`,
        [orderId, paymentMethod, totalAmount, paymentMethod === 'SCHOOL_COUNTER_CASH' ? 'PENDING' : 'PENDING']
      );

      // 7. Clear user cart
      await conn.execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

      // 8. Create parent notification
      await conn.execute(
        `INSERT INTO notifications (user_id, title_en, title_ar, message_en, message_ar, action_url)
         VALUES (?, 'Order Placed Successfully', 'تم استلام طلبكم بنجاح',
                 ?, ?, ?)`,
        [
          userId,
          `Your order #${orderNumber} for ${totalAmount.toFixed(3)} OMR has been received.`,
          `تم استلام طلبكم رقم #${orderNumber} بقيمة ${totalAmount.toFixed(3)} ر.ع. بنجاح.`,
          `/orders/${orderId}`
        ]
      );

      // 9. Audit log
      await conn.execute(
        `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
         VALUES (?, 'ORDER_CREATED', 'ORDER', ?, ?, ?)`,
        [userId, orderId.toString(), JSON.stringify({ orderNumber, totalAmount, itemsCount: cartItems.length }), req.ip || null]
      );

      return { orderId, orderNumber, totalAmount, fulfillmentMethod };
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! We will prepare your school uniform essentials.',
      order: orderResult
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const userId = req.user.id;

    const orders = await query(
      `SELECT o.id, o.order_number, o.fulfillment_method, o.status,
              o.subtotal, o.shipping_fee, o.total_amount, o.pickup_campus, o.created_at,
              COUNT(oi.id) AS items_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    );

    const formatted = orders.map(o => ({
      ...o,
      subtotal: parseFloat(o.subtotal).toFixed(3),
      total_amount: parseFloat(o.total_amount).toFixed(3),
      currency: 'OMR'
    }));

    res.json({
      success: true,
      orders: formatted
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Check ownership or admin role
    const isAdmin = req.user.roles.includes('ADMIN') || req.user.roles.includes('STAFF');
    let orderSql = 'SELECT * FROM orders WHERE id = ?';
    const params = [id];

    if (!isAdmin) {
      orderSql += ' AND user_id = ?';
      params.push(userId);
    }

    const orders = await query(orderSql, params);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    const order = orders[0];

    const items = await query(
      `SELECT oi.*, pv.sku, pi.image_url
       FROM order_items oi
       JOIN product_variants pv ON oi.variant_id = pv.id
       JOIN products p ON pv.product_id = p.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
       WHERE oi.order_id = ?`,
      [id]
    );

    const payments = await query('SELECT * FROM payments WHERE order_id = ?', [id]);

    res.json({
      success: true,
      order: {
        ...order,
        subtotal: parseFloat(order.subtotal).toFixed(3),
        total_amount: parseFloat(order.total_amount).toFixed(3),
        items: items.map(item => ({
          ...item,
          unit_price: parseFloat(item.unit_price).toFixed(3),
          subtotal: parseFloat(item.subtotal).toFixed(3)
        })),
        payments: payments.map(p => ({
          ...p,
          amount: parseFloat(p.amount).toFixed(3)
        })),
        currency: 'OMR'
      }
    });
  } catch (error) {
    next(error);
  }
}

