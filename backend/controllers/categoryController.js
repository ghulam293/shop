import { memoryStore } from '../config/db.js';

export async function getAllCategories(req, res, next) {
  try {
    const categories = memoryStore.categories.map(c => {
      const prods = memoryStore.products.filter(p => p.category_slug === c.slug && p.is_active);
      const stock = prods.reduce((sum, p) => sum + (p.total_available_stock || 0), 0);
      return {
        ...c,
        product_count: prods.length,
        total_stock: stock
      };
    });

    res.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
}
