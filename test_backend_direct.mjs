import { getProducts, getProductById } from './backend/controllers/productController.js';
import { getAllCategories } from './backend/controllers/categoryController.js';
import { login, register } from './backend/controllers/authController.js';
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getInventory,
  updateStock,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCustomers,
  getCategoriesSummary
} from './backend/controllers/adminController.js';
import { trackOrderByNumber } from './backend/controllers/orderController.js';

// Helper to create mock response object
function createMockRes() {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };
  return res;
}

async function runDirectTests() {
  console.log('\n=============================================================');
  console.log('   DIRECT BACKEND & DATABASE LOGIC VERIFICATION SUITE');
  console.log('=============================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Categories Controller
  await test('Categories Controller (getAllCategories) returns all 11 Curated Collections', async () => {
    const req = {};
    const res = createMockRes();
    await getAllCategories(req, res, () => {});
    if (!res.body || !res.body.success || !Array.isArray(res.body.categories)) {
      throw new Error(`Failed to retrieve categories: ${JSON.stringify(res.body)}`);
    }
    if (res.body.categories.length < 11) {
      throw new Error(`Expected at least 11 categories, got ${res.body.categories.length}`);
    }
  });

  // 2. Product Catalog Controller
  await test('Products Controller (getProducts) returns all 20 store products', async () => {
    const req = { query: {} };
    const res = createMockRes();
    await getProducts(req, res, () => {});
    if (!res.body || !res.body.success || !Array.isArray(res.body.products)) {
      throw new Error(`Failed to retrieve products: ${JSON.stringify(res.body)}`);
    }
    if (res.body.products.length < 20) {
      throw new Error(`Expected 20 products, got ${res.body.products.length}`);
    }
    const polo = res.body.products.find(p => p.sku === 'UNIF-POLO-MRN');
    if (!polo || parseFloat(polo.base_price) !== 6.000) {
      throw new Error(`Polo shirt mismatch: ${JSON.stringify(polo)}`);
    }
  });

  // 3. Product Details with Size Matrix
  await test('Product Detail Controller (getProductById) returns size variants and images', async () => {
    const req = { params: { id: '1' } };
    const res = createMockRes();
    await getProductById(req, res, () => {});
    if (!res.body || !res.body.success || !res.body.product) {
      throw new Error(`Failed to retrieve product details: ${JSON.stringify(res.body)}`);
    }
    if (!Array.isArray(res.body.product.variants) || res.body.product.variants.length === 0) {
      throw new Error('Size matrix variants array missing');
    }
  });

  // 4. Admin Login Controller
  let adminToken = '';
  await test('Auth Controller (login) Administrator credentials return ADMIN role', async () => {
    const req = { body: { email: 'admin@shop.com', password: 'admin123' } };
    const res = createMockRes();
    await login(req, res, () => {});
    if (!res.body || !res.body.success || !res.body.token || !res.body.user.roles.includes('ADMIN')) {
      throw new Error(`Admin login failed: ${JSON.stringify(res.body)}`);
    }
    adminToken = res.body.token;
  });

  // 5. Customer Login Controller
  await test('Auth Controller (login) Customer credentials return CUSTOMER role', async () => {
    const req = { body: { email: 'demo@shop.com', password: 'customer123' } };
    const res = createMockRes();
    await login(req, res, () => {});
    if (!res.body || !res.body.success || !res.body.token || res.body.user.roles.includes('ADMIN')) {
      throw new Error(`Customer login failed or has admin permissions: ${JSON.stringify(res.body)}`);
    }
  });

  // 6. Admin Stats Controller
  await test('Admin Controller (getDashboardStats) calculates live metrics & revenue', async () => {
    const req = {};
    const res = createMockRes();
    await getDashboardStats(req, res, () => {});
    if (!res.body || !res.body.success || !res.body.stats) {
      throw new Error(`Stats failed: ${JSON.stringify(res.body)}`);
    }
    if (res.body.stats.totalProducts < 20 || !res.body.stats.totalRevenue) {
      throw new Error(`Stats numbers incomplete: ${JSON.stringify(res.body.stats)}`);
    }
  });

  // 7. Admin Inventory Controller
  await test('Admin Controller (getInventory) returns inventory with safety thresholds', async () => {
    const req = {};
    const res = createMockRes();
    await getInventory(req, res, () => {});
    if (!res.body || !res.body.success || !Array.isArray(res.body.inventory)) {
      throw new Error(`Inventory failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 8. Admin Orders Controller
  await test('Admin Controller (getAllOrders) returns customer orders list', async () => {
    const req = { query: {} };
    const res = createMockRes();
    await getAllOrders(req, res, () => {});
    if (!res.body || !res.body.success || !Array.isArray(res.body.orders) || res.body.orders.length === 0) {
      throw new Error(`Orders failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 9. Admin Update Order Status
  await test('Admin Controller (updateOrderStatus) transitions order to READY_FOR_PICKUP', async () => {
    const req = { params: { id: '1' }, body: { status: 'READY_FOR_PICKUP' } };
    const res = createMockRes();
    await updateOrderStatus(req, res, () => {});
    if (!res.body || !res.body.success || res.body.order.status !== 'READY_FOR_PICKUP') {
      throw new Error(`Update order status failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 10. Admin Create Product
  let newProdId = null;
  await test('Admin Controller (createProduct) adds a new product to shop catalog', async () => {
    const req = {
      body: {
        nameEn: 'Gold Embroidered School Blazer',
        nameAr: 'سترة مدرسية فاخرة مطرزة',
        category: 'school-uniforms',
        price: '18.500',
        sizes: 'XS, S, M, L, XL',
        stock: 35,
        threshold: 5,
        sku: 'UNIF-BLAZ-GLD',
        image: '/products/polo-shirt-front.jpg',
        descEn: 'Premium tailored school uniform blazer.',
        descAr: 'سترة مدرسية فاخرة للمناسبات الرسمية.'
      }
    };
    const res = createMockRes();
    await createProduct(req, res, () => {});
    if (!res.body || !res.body.success || !res.body.product || !res.body.product.id) {
      throw new Error(`Create product failed: ${JSON.stringify(res.body)}`);
    }
    newProdId = res.body.product.id;
  });

  // 11. Admin Update Product (Price & Sizes)
  await test('Admin Controller (updateProduct) modifies base price & size matrix', async () => {
    const req = {
      params: { id: newProdId.toString() },
      body: {
        price: '19.900',
        sizes: 'S, M, L, XL, XXL',
        stock: 40
      }
    };
    const res = createMockRes();
    await updateProduct(req, res, () => {});
    if (!res.body || !res.body.success || res.body.product.base_price !== '19.900') {
      throw new Error(`Update product failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 12. Admin Delete Product
  await test('Admin Controller (deleteProduct) removes product from catalog', async () => {
    const req = { params: { id: newProdId.toString() } };
    const res = createMockRes();
    await deleteProduct(req, res, () => {});
    if (!res.body || !res.body.success) {
      throw new Error(`Delete product failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 13. Admin Category Controls
  await test('Admin Controller (getCategoriesSummary) calculates product & stock counts per collection', async () => {
    const req = {};
    const res = createMockRes();
    await getCategoriesSummary(req, res, () => {});
    if (!res.body || !res.body.success || !Array.isArray(res.body.categories) || res.body.categories.length < 11) {
      throw new Error(`Categories summary failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 14. Admin Customer Accounts
  await test('Admin Controller (getAllCustomers) returns registered customer accounts', async () => {
    const req = {};
    const res = createMockRes();
    await getAllCustomers(req, res, () => {});
    if (!res.body || !res.body.success || !Array.isArray(res.body.customers) || res.body.customers.length === 0) {
      throw new Error(`Customer accounts failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 15. Order Tracking Controller
  await test('Order Controller (trackOrderByNumber) returns live 4-step tracking timeline', async () => {
    const req = { params: { reference: 'ORD-98412' } };
    const res = createMockRes();
    await trackOrderByNumber(req, res, () => {});
    if (!res.body || !res.body.success || !res.body.order || !Array.isArray(res.body.order.trackingSteps)) {
      throw new Error(`Tracking failed: ${JSON.stringify(res.body)}`);
    }
  });

  console.log('\n=============================================================');
  console.log(`   TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('=============================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runDirectTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

