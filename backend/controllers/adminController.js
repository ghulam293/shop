import { query, transaction, memoryStore } from '../config/db.js';

/**
 * 1. Overview Dashboard Metrics
 */
export async function getDashboardStats(req, res, next) {
  try {
    const products = memoryStore.products.filter(p => p.is_active);
    const orders = memoryStore.orders;
    const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING');
    const completedOrders = orders.filter(o => o.status === 'COMPLETED');
    const totalRevenue = orders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
    const lowStockCount = products.filter(p => (p.total_available_stock || 0) <= (p.threshold || 10)).length;

    res.json({
      success: true,
      stats: {
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders: pendingOrders.length,
        completedOrders: completedOrders.length,
        totalRevenue: totalRevenue.toFixed(3),
        lowStockCount,
        currency: 'OMR'
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 2. Get All Customer Orders
 */
export async function getAllOrders(req, res, next) {
  try {
    const { status } = req.query;
    let orders = memoryStore.orders;
    if (status && status !== 'ALL') {
      orders = orders.filter(o => o.status === status);
    }

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

/**
 * 3. Update Order Status
 */
export async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['PENDING', 'CONFIRMED', 'PROCESSING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status value.' });
    }

    const order = memoryStore.orders.find(o => o.id === parseInt(id, 10) || o.order_number === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order reference not found.' });
    }

    order.status = status;
    order.updated_at = new Date().toISOString();

    res.json({
      success: true,
      message: `Order #${order.order_number} status updated to ${status}.`,
      order
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 4. Get Inventory List
 */
export async function getInventory(req, res, next) {
  try {
    const inventory = memoryStore.products.map(p => ({
      product_id: p.id,
      name_en: p.name_en,
      name_ar: p.name_ar,
      sku: p.sku,
      category_name: p.category_slug,
      stock_quantity: p.total_available_stock || 0,
      low_stock_threshold: p.threshold || 10,
      is_low_stock: (p.total_available_stock || 0) <= (p.threshold || 10),
      sizes: p.sizes || ['Standard'],
      price: p.base_price
    }));

    res.json({
      success: true,
      inventory
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 5. Update Inventory Stock & Threshold
 */
export async function updateStock(req, res, next) {
  try {
    const { variantId } = req.params;
    const { stockQuantity, lowStockThreshold } = req.body;

    const targetId = parseInt(variantId, 10);
    const prod = memoryStore.products.find(p => p.id === targetId);

    if (prod) {
      if (stockQuantity !== undefined) prod.total_available_stock = parseInt(stockQuantity, 10);
      if (lowStockThreshold !== undefined) prod.threshold = parseInt(lowStockThreshold, 10);
    }

    res.json({
      success: true,
      message: 'Stock level updated successfully.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 6. Admin Create New Product
 */
export async function createProduct(req, res, next) {
  try {
    const {
      nameEn,
      nameAr,
      category,
      price,
      sizes,
      stock,
      threshold,
      sku,
      image,
      descEn,
      descAr
    } = req.body;

    if (!nameEn || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product name, category, and price are required.'
      });
    }

    const newId = memoryStore.nextProductId++;
    const generatedSku = (sku || `SHOP-ITEM-${newId}`).toUpperCase().trim();
    const parsedSizes = Array.isArray(sizes)
      ? sizes
      : (typeof sizes === 'string' && sizes.trim() ? sizes.split(',').map(s => s.trim()) : ['Standard']);

    const newProduct = {
      id: newId,
      category_id: 1,
      category_slug: category,
      sku: generatedSku,
      name_en: nameEn.trim(),
      name_ar: (nameAr || nameEn).trim(),
      subtitle_en: `${nameEn.trim()} — Official Item`,
      subtitle_ar: `${(nameAr || nameEn).trim()} — صنف معتمد`,
      base_price: parseFloat(price).toFixed(3),
      primary_image: image || '/products/polo-shirt-front.jpg',
      description_en: (descEn || 'High-quality school store item.').trim(),
      description_ar: (descAr || 'منتج عالي الجودة متوفر لدى المتجر.').trim(),
      sizes: parsedSizes,
      total_available_stock: parseInt(stock, 10) || 50,
      threshold: parseInt(threshold, 10) || 10,
      featured: 0,
      is_active: 1
    };

    memoryStore.products.unshift(newProduct);

    res.status(201).json({
      success: true,
      message: 'Product created and added to shop catalog successfully.',
      product: newProduct
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 7. Admin Update Existing Product (Price, Sizes, Stock, SKU, Descriptions)
 */
export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const targetId = parseInt(id, 10);
    const prod = memoryStore.products.find(p => p.id === targetId);

    if (!prod) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    const {
      nameEn,
      nameAr,
      category,
      price,
      sizes,
      stock,
      threshold,
      sku,
      image,
      descEn,
      descAr
    } = req.body;

    if (nameEn) prod.name_en = nameEn.trim();
    if (nameAr) prod.name_ar = nameAr.trim();
    if (category) prod.category_slug = category;
    if (price !== undefined) prod.base_price = parseFloat(price).toFixed(3);
    if (stock !== undefined) prod.total_available_stock = parseInt(stock, 10);
    if (threshold !== undefined) prod.threshold = parseInt(threshold, 10);
    if (sku) prod.sku = sku.trim().toUpperCase();
    if (image) prod.primary_image = image;
    if (descEn !== undefined) prod.description_en = descEn.trim();
    if (descAr !== undefined) prod.description_ar = descAr.trim();

    if (sizes) {
      prod.sizes = Array.isArray(sizes)
        ? sizes
        : sizes.split(',').map(s => s.trim()).filter(Boolean);
    }

    res.json({
      success: true,
      message: 'Product details updated successfully.',
      product: prod
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 8. Admin Delete Product
 */
export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const targetId = parseInt(id, 10);
    const index = memoryStore.products.findIndex(p => p.id === targetId);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in catalog.'
      });
    }

    const [deleted] = memoryStore.products.splice(index, 1);

    res.json({
      success: true,
      message: `Product "${deleted.name_en}" removed from catalog successfully.`
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 9. Get Customer Accounts
 */
export async function getAllCustomers(req, res, next) {
  try {
    let dbCustomers = [];
    try {
      dbCustomers = await query(`
        SELECT u.id, u.full_name AS name, u.email, u.phone_number AS phone,
               u.is_active, u.created_at
        FROM users u
        WHERE u.email NOT LIKE 'admin%'
        ORDER BY u.created_at DESC
      `);
    } catch (dbErr) {
      console.warn('DB customers query fallback:', dbErr.message);
    }

    if (dbCustomers && dbCustomers.length > 0) {
      const formatted = dbCustomers.map(c => ({
        id: c.id,
        name: c.name || 'Customer',
        email: c.email,
        phone: c.phone || '+968 90 000000',
        status: c.is_active === 0 ? 'Blocked' : 'Active'
      }));
      return res.json({ success: true, customers: formatted });
    }

    const fallback = (memoryStore.customers || []).map(c => ({
      id: c.id,
      name: c.name || 'Customer',
      email: c.email,
      phone: c.phone || '+968 90 000000',
      status: 'Active'
    }));

    res.json({
      success: true,
      customers: fallback
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 9b. Create New Customer Account (from Admin Dashboard)
 */
export async function createCustomer(req, res, next) {
  try {
    const { name, email, phone, status } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Customer name and email are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let insertId = Date.now();
    try {
      const result = await query(
        'INSERT INTO users (full_name, email, phone_number, is_active) VALUES (?, ?, ?, ?)',
        [name.trim(), cleanEmail, phone ? phone.trim() : '+968 90 000000', status === 'Blocked' ? 0 : 1]
      );
      if (result && result.insertId) {
        insertId = result.insertId;
      }
    } catch (err) {
      console.warn('DB create customer insert fallback:', err.message);
    }

    const created = {
      id: insertId,
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '+968 90 000000',
      ordersCount: 0,
      totalSpend: '0.000',
      status: status || 'Active'
    };

    if (Array.isArray(memoryStore.customers)) {
      memoryStore.customers.unshift(created);
    }

    res.status(201).json({
      success: true,
      message: 'Customer account created successfully.',
      customer: created
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 10. Get Category Controls Summary
 */
export async function getCategoriesSummary(req, res, next) {
  try {
    const summary = memoryStore.categories.map(c => {
      const prods = memoryStore.products.filter(p => p.category_slug === c.slug && p.is_active);
      const stock = prods.reduce((sum, p) => sum + (p.total_available_stock || 0), 0);
      return {
        ...c,
        productCount: prods.length,
        totalStock: stock
      };
    });

    res.json({
      success: true,
      categories: summary
    });
  } catch (error) {
    next(error);
  }
}
