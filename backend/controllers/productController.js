import { query } from '../config/db.js';

export async function getProducts(req, res, next) {
  try {
    const { category, search, featured, sort } = req.query;

    let sql = `
      SELECT p.id, p.category_id, p.sku, p.name_en, p.name_ar,
             p.description_en, p.description_ar, p.base_price, p.featured,
             c.name_en AS category_name_en, c.name_ar AS category_name_ar, c.slug AS category_slug,
             pi.image_url AS primary_image,
             COALESCE(SUM(inv.stock_quantity - inv.reserved_quantity), 0) AS total_available_stock
      FROM products p
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      LEFT JOIN inventory inv ON pv.id = inv.variant_id
      WHERE p.is_active = 1
    `;

    const params = [];

    if (category && category !== 'all') {
      sql += ` AND (c.slug = ? OR c.id = ?)`;
      params.push(category, category);
    }

    if (featured === '1' || featured === 'true') {
      sql += ` AND p.featured = 1`;
    }

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      sql += ` AND (p.name_en LIKE ? OR p.name_ar LIKE ? OR p.sku LIKE ? OR p.description_en LIKE ? OR p.description_ar LIKE ?)`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    sql += ` GROUP BY p.id, pi.image_url`;

    // Sorting
    switch (sort) {
      case 'price_asc':
        sql += ` ORDER BY p.base_price ASC`;
        break;
      case 'price_desc':
        sql += ` ORDER BY p.base_price DESC`;
        break;
      case 'newest':
        sql += ` ORDER BY p.created_at DESC`;
        break;
      default:
        sql += ` ORDER BY p.featured DESC, p.id ASC`;
        break;
    }

    const products = await query(sql, params);

    const formatted = products.map(p => ({
      ...p,
      base_price: parseFloat(p.base_price).toFixed(3),
      in_stock: p.total_available_stock > 0
    }));

    res.json({
      success: true,
      count: formatted.length,
      products: formatted
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const { id } = req.params;

    // Fetch product
    const products = await query(
      `SELECT p.id, p.category_id, p.sku, p.name_en, p.name_ar,
              p.description_en, p.description_ar, p.base_price, p.featured,
              c.name_en AS category_name_en, c.name_ar AS category_name_ar, c.slug AS category_slug
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = ? AND p.is_active = 1`,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    const product = products[0];

    // Fetch all gallery images
    const images = await query(
      `SELECT id, image_url, alt_text, is_primary, sort_order
       FROM product_images
       WHERE product_id = ?
       ORDER BY is_primary DESC, sort_order ASC, id ASC`,
      [id]
    );

    // Fetch all variants with live stock
    const variants = await query(
      `SELECT pv.id, pv.sku, pv.size, pv.price_override,
              COALESCE(inv.stock_quantity - inv.reserved_quantity, 0) AS available_stock,
              inv.low_stock_threshold
       FROM product_variants pv
       LEFT JOIN inventory inv ON pv.id = inv.variant_id
       WHERE pv.product_id = ?
       ORDER BY pv.id ASC`,
      [id]
    );

    // Fetch related products (same category or uniforms recommendations)
    const related = await query(
      `SELECT p.id, p.sku, p.name_en, p.name_ar, p.base_price,
              pi.image_url AS primary_image
       FROM products p
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
       WHERE p.id != ? AND p.is_active = 1
       LIMIT 6`,
      [id]
    );

    res.json({
      success: true,
      product: {
        ...product,
        base_price: parseFloat(product.base_price).toFixed(3),
        images: images.length > 0 ? images : [{ image_url: '/products/polo-shirt-front.jpg', is_primary: 1 }],
        variants: variants.map(v => ({
          ...v,
          price: parseFloat(v.price_override || product.base_price).toFixed(3),
          in_stock: v.available_stock > 0
        })),
        related: related.map(r => ({
          ...r,
          base_price: parseFloat(r.base_price).toFixed(3)
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

