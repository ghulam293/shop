import { query } from '../config/db.js';

export async function getDashboardStats(req, res, next) {
  try {
    const [productsCount] = await query('SELECT COUNT(*) AS total FROM products WHERE is_active = 1');
    const [ordersCount] = await query('SELECT COUNT(*) AS total FROM orders');
    const [pendingOrders] = await query("SELECT COUNT(*) AS total FROM orders WHERE status IN ('PENDING', 'PROCESSING')");
    const [completedOrders] = await query("SELECT COUNT(*) AS total FROM orders WHERE status = 'COMPLETED'");
    const [revenueRes] = await query("SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders WHERE status != 'CANCELLED'");
    const [lowStockRes] = await query(
      `SELECT COUNT(*) AS total FROM inventory WHERE stock_quantity <= low_stock_threshold`
    );

    res.json({
      success: true,
      stats: {
        totalProducts: productsCount.total,
        totalOrders: ordersCount.total,
        pendingOrders: pendingOrders.total,
        completedOrders: completedOrders.total,
        totalRevenue: parseFloat(revenueRes.total).toFixed(3),
        lowStockCount: lowStockRes.total,
        currency: 'OMR'
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllOrders(req, res, next) {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let sql = `
      SELECT o.id, o.order_number, o.status, o.fulfillment_method, o.total_amount,
             o.created_at, u.full_name AS parent_name, u.email AS parent_email, u.phone_number AS parent_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
    `;
    const params = [];

    if (status && status !== 'ALL') {
      sql += ' WHERE o.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const orders = await query(sql, params);

    res.json({
      success: true,
      orders: orders.map(o => ({
        ...o,
        total_amount: parseFloat(o.total_amount).toFixed(3),
        currency: 'OMR'
      }))
    });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['PENDING', 'CONFIRMED', 'PROCESSING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status.'
      });
    }

    const orders = await query('SELECT * FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const order = orders[0];

    await query('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);

    // Send notification to parent
    await query(
      `INSERT INTO notifications (user_id, title_en, title_ar, message_en, message_ar, action_url)
       VALUES (?, 'Order Status Updated', 'تحديث في حالة طلبكم',
               ?, ?, ?)`,
      [
        order.user_id,
        `Your order #${order.order_number} is now marked as ${status.replace(/_/g, ' ')}.`,
        `تم تحديث حالة طلبكم رقم #${order.order_number} إلى: ${status}.`,
        `/orders/${id}`
      ]
    );

    // Audit log
    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
       VALUES (?, 'ADMIN_UPDATE_ORDER_STATUS', 'ORDER', ?, ?, ?)`,
      [req.user.id, id.toString(), JSON.stringify({ oldStatus: order.status, newStatus: status }), req.ip || null]
    );

    res.json({
      success: true,
      message: `Order status updated to ${status}.`
    });
  } catch (error) {
    next(error);
  }
}

export async function getInventory(req, res, next) {
  try {
    const inventory = await query(
      `SELECT inv.variant_id, inv.stock_quantity, inv.reserved_quantity, inv.low_stock_threshold,
              inv.updated_at,
              pv.sku AS variant_sku, pv.size,
              p.id AS product_id, p.name_en, p.name_ar, p.sku AS product_sku,
              c.name_en AS category_name
       FROM inventory inv
       JOIN product_variants pv ON inv.variant_id = pv.id
       JOIN products p ON pv.product_id = p.id
       JOIN categories c ON p.category_id = c.id
       ORDER BY (inv.stock_quantity <= inv.low_stock_threshold) DESC, p.id ASC, pv.id ASC`
    );

    res.json({
      success: true,
      inventory: inventory.map(item => ({
        ...item,
        is_low_stock: item.stock_quantity <= item.low_stock_threshold
      }))
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStock(req, res, next) {
  try {
    const { variantId } = req.params;
    const { stockQuantity, lowStockThreshold } = req.body;

    const newStock = parseInt(stockQuantity, 10);
    if (isNaN(newStock) || newStock < 0) {
      return res.status(400).json({ success: false, message: 'Stock quantity must be a non-negative integer.' });
    }

    const threshold = parseInt(lowStockThreshold, 10) || 5;

    await query(
      `UPDATE inventory
       SET stock_quantity = ?, low_stock_threshold = ?, last_restocked_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE variant_id = ?`,
      [newStock, threshold, variantId]
    );

    // Audit log
    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
       VALUES (?, 'UPDATE_STOCK', 'INVENTORY', ?, ?, ?)`,
      [req.user.id, variantId.toString(), JSON.stringify({ stockQuantity: newStock, lowStockThreshold: threshold }), req.ip || null]
    );

    res.json({
      success: true,
      message: 'Inventory stock updated successfully.'
    });
  } catch (error) {
    next(error);
  }
}

