import { query, memoryStore } from '../config/db.js';

export async function getProducts(req, res, next) {
  try {
    const { category, search, featured, sort } = req.query;

    let products = memoryStore.products.filter(p => p.is_active);

    // Filter by Category
    if (category && category !== 'all') {
      products = products.filter(p => p.category_slug === category || p.category_id === parseInt(category, 10));
    }

    // Filter by Featured
    if (featured === '1' || featured === 'true') {
      products = products.filter(p => p.featured === 1);
    }

    // Search
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      products = products.filter(p =>
        (p.name_en && p.name_en.toLowerCase().includes(q)) ||
        (p.name_ar && p.name_ar.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.description_en && p.description_en.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        products.sort((a, b) => parseFloat(a.base_price) - parseFloat(b.base_price));
        break;
      case 'price_desc':
        products.sort((a, b) => parseFloat(b.base_price) - parseFloat(a.base_price));
        break;
      default:
        // Featured first
        products.sort((a, b) => (b.featured || 0) - (a.featured || 0));
        break;
    }

    const formatted = products.map(p => ({
      ...p,
      category_name_en: (memoryStore.categories.find(c => c.id === p.category_id) || {}).name_en || 'Collection',
      category_name_ar: (memoryStore.categories.find(c => c.id === p.category_id) || {}).name_ar || 'التشكيلة',
      in_stock: (p.total_available_stock || 0) > 0
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
    const targetId = parseInt(id, 10);

    const product = memoryStore.products.find(p => p.id === targetId && p.is_active);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in store catalog.'
      });
    }

    const category = memoryStore.categories.find(c => c.id === product.category_id) || {
      name_en: 'Curated Department',
      name_ar: 'القسم المعتمد',
      slug: product.category_slug
    };

    const related = memoryStore.products
      .filter(p => p.id !== product.id && p.is_active)
      .slice(0, 4)
      .map(p => ({
        id: p.id,
        sku: p.sku,
        name_en: p.name_en,
        name_ar: p.name_ar,
        base_price: p.base_price,
        primary_image: p.primary_image
      }));

    res.json({
      success: true,
      product: {
        ...product,
        category_name_en: category.name_en,
        category_name_ar: category.name_ar,
        images: [{ image_url: product.primary_image, is_primary: 1 }],
        variants: (product.sizes || ['Standard']).map((s, idx) => ({
          id: idx + 1,
          sku: `${product.sku}-${s}`,
          size: s,
          price: product.base_price,
          in_stock: (product.total_available_stock || 0) > 0,
          available_stock: product.total_available_stock || 0
        })),
        related
      }
    });
  } catch (error) {
    next(error);
  }
}
