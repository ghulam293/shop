import http from 'http';
import app from './backend/server.js';

const TEST_PORT = 5055;

async function runTests() {
  console.log('\n=============================================================');
  console.log('   SHOP BACKEND & DATABASE SYSTEM AUTOMATED TEST SUITE');
  console.log('=============================================================\n');

  // Start test server
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
  const baseUrl = `http://127.0.0.1:${TEST_PORT}`;
  console.log(`🚀 Test Server listening at ${baseUrl}\n`);

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

  // 1. Health Check
  await test('System & Database Health Check (GET /api/health)', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const data = await res.json();
    if (res.status !== 200 || data.status !== 'UP') {
      throw new Error(`Unexpected status: ${JSON.stringify(data)}`);
    }
  });

  // 2. Categories
  await test('The 11 Curated Collections (GET /api/categories)', async () => {
    const res = await fetch(`${baseUrl}/api/categories`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.categories) || data.categories.length < 11) {
      throw new Error(`Expected at least 11 categories, got ${data.categories?.length}`);
    }
    const uniformCat = data.categories.find(c => c.slug === 'school-uniforms');
    if (!uniformCat || !uniformCat.name_ar) {
      throw new Error('School uniforms category or Arabic title missing');
    }
  });

  // 3. Products List
  await test('Storefront Catalog (GET /api/products)', async () => {
    const res = await fetch(`${baseUrl}/api/products`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.products) || data.products.length < 20) {
      throw new Error(`Expected 20 products, got ${data.products?.length}`);
    }
    const polo = data.products.find(p => p.sku === 'UNIF-POLO-MRN');
    if (!polo || parseFloat(polo.base_price) !== 6.000) {
      throw new Error(`Polo shirt price or SKU mismatch: ${JSON.stringify(polo)}`);
    }
  });

  // 4. Product Details with Sizes Matrix
  await test('Product Detail with Size Matrix (GET /api/products/1)', async () => {
    const res = await fetch(`${baseUrl}/api/products/1`);
    const data = await res.json();
    if (!data.success || !data.product) {
      throw new Error('Product 1 not found');
    }
    if (!Array.isArray(data.product.variants) || data.product.variants.length === 0) {
      throw new Error('Product variants size matrix missing');
    }
  });

  // 5. Admin Authentication
  let adminToken = '';
  await test('Administrator Login & RBAC Token (POST /api/auth/login)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@shop.com', password: 'admin123' })
    });
    const data = await res.json();
    if (!data.success || !data.token || !data.user.roles.includes('ADMIN')) {
      throw new Error(`Admin login failed: ${JSON.stringify(data)}`);
    }
    adminToken = data.token;
  });

  // 6. Customer Authentication
  await test('Customer Login & RBAC Token (POST /api/auth/login)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@shop.com', password: 'customer123' })
    });
    const data = await res.json();
    if (!data.success || !data.token || data.user.roles.includes('ADMIN')) {
      throw new Error(`Customer login failed or has admin role: ${JSON.stringify(data)}`);
    }
  });

  // 7. Admin Dashboard Stats
  await test('Admin Overview Metrics (GET /api/admin/stats)', async () => {
    const res = await fetch(`${baseUrl}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (!data.success || !data.stats || !data.stats.totalRevenue) {
      throw new Error(`Stats failed: ${JSON.stringify(data)}`);
    }
  });

  // 8. Admin Inventory & Low-Stock Alerts
  await test('Admin Inventory & Stock Monitoring (GET /api/admin/inventory)', async () => {
    const res = await fetch(`${baseUrl}/api/admin/inventory`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (!data.success || !Array.isArray(data.inventory)) {
      throw new Error(`Inventory failed: ${JSON.stringify(data)}`);
    }
  });

  // 9. Admin Manage Orders
  await test('Admin Orders Management (GET /api/admin/orders)', async () => {
    const res = await fetch(`${baseUrl}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (!data.success || !Array.isArray(data.orders) || data.orders.length === 0) {
      throw new Error(`Orders failed: ${JSON.stringify(data)}`);
    }
  });

  // 10. Admin Update Order Status
  await test('Admin Update Order Status (PUT /api/admin/orders/1/status)', async () => {
    const res = await fetch(`${baseUrl}/api/admin/orders/1/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'READY_FOR_PICKUP' })
    });
    const data = await res.json();
    if (!data.success || data.order.status !== 'READY_FOR_PICKUP') {
      throw new Error(`Update order status failed: ${JSON.stringify(data)}`);
    }
  });

  // 11. Admin Create New Product
  let createdProductId = null;
  await test('Admin Add Product to Shop (POST /api/admin/products)', async () => {
    const res = await fetch(`${baseUrl}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
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
      })
    });
    const data = await res.json();
    if (!data.success || !data.product || !data.product.id) {
      throw new Error(`Create product failed: ${JSON.stringify(data)}`);
    }
    createdProductId = data.product.id;
  });

  // 12. Admin Update Product (Price & Sizes)
  await test('Admin Edit Price & Sizes (PUT /api/admin/products/:id)', async () => {
    const res = await fetch(`${baseUrl}/api/admin/products/${createdProductId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        price: '19.900',
        sizes: 'S, M, L, XL, XXL',
        stock: 40
      })
    });
    const data = await res.json();
    if (!data.success || data.product.base_price !== '19.900') {
      throw new Error(`Update product failed: ${JSON.stringify(data)}`);
    }
  });

  // 13. Admin Delete Product
  await test('Admin Delete Product (DELETE /api/admin/products/:id)', async () => {
    const res = await fetch(`${baseUrl}/api/admin/products/${createdProductId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(`Delete product failed: ${JSON.stringify(data)}`);
    }
  });

  // 14. Admin Category Controls
  await test('Admin Category Controls Summary (GET /api/admin/categories)', async () => {
    const res = await fetch(`${baseUrl}/api/admin/categories`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (!data.success || !Array.isArray(data.categories) || data.categories.length < 11) {
      throw new Error(`Admin categories failed: ${JSON.stringify(data)}`);
    }
  });

  // 15. Admin Customer Directory
  await test('Admin Customer Directory (GET /api/admin/customers)', async () => {
    const res = await fetch(`${baseUrl}/api/admin/customers`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (!data.success || !Array.isArray(data.customers) || data.customers.length === 0) {
      throw new Error(`Admin customers failed: ${JSON.stringify(data)}`);
    }
  });

  // 16. Public Live Order Tracking
  await test('Live Order Tracking Lookup (GET /api/orders/track/ORD-98412)', async () => {
    const res = await fetch(`${baseUrl}/api/orders/track/ORD-98412`);
    const data = await res.json();
    if (!data.success || !data.order || !Array.isArray(data.order.trackingSteps)) {
      throw new Error(`Tracking failed: ${JSON.stringify(data)}`);
    }
  });

  // Shutdown server
  server.close();

  console.log('\n=============================================================');
  console.log(`   TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('=============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test suite runner error:', err);
  process.exit(1);
});

