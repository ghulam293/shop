import { query } from '../config/db.js';

export async function getAllCategories(req, res, next) {
  try {
    const categories = await query(
      `SELECT c.id, c.name_en, c.name_ar, c.slug, c.icon_name, c.display_order,
              COUNT(p.id) AS product_count
       FROM categories c
       LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
       WHERE c.is_active = 1
       GROUP BY c.id
       ORDER BY c.display_order ASC, c.name_en ASC`
    );

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    next(error);
  }
}

