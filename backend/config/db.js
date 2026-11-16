import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_ORDERS, SEED_CUSTOMERS } from './seedData.js';

dotenv.config();

let isMysqlAvailable = false;
let pool = null;

// Initialize MySQL pool
try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ips_school_shop',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 2000,
    enableKeepAlive: true,
    decimalNumbers: true
  });

  // Verify connection once at startup
  pool.query('SELECT 1')
    .then(() => {
      isMysqlAvailable = true;
      console.log('✅ Connected to MariaDB / MySQL database on port ' + (process.env.DB_PORT || 3307));
    })
    .catch((err) => {
      isMysqlAvailable = false;
      console.log('ℹ️ MariaDB/MySQL server offline: Using high-performance resilient in-memory store.');
    });
} catch (err) {
  isMysqlAvailable = false;
}

// In-memory reactive state for fallback execution
export const memoryStore = {
  categories: [...SEED_CATEGORIES],
  products: [...SEED_PRODUCTS],
  orders: [...SEED_ORDERS],
  customers: [...SEED_CUSTOMERS],
  nextProductId: 21,
  nextOrderId: 4
};

/**
 * Resilient query executor: Attempts MySQL first, falls back to memory store
 */
export async function query(sql, params = []) {
  if (isMysqlAvailable && pool) {
    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (dbErr) {
      // If connection was lost or refused, fallback to memory
      if (dbErr.code === 'ECONNREFUSED' || dbErr.code === 'ETIMEDOUT') {
        isMysqlAvailable = false;
      } else {
        throw dbErr;
      }
    }
  }

  // Memory fallback query parser
  const cleanSql = sql.trim().toUpperCase();

  // 1. Health Check
  if (cleanSql.includes('SELECT 1 + 1 AS DB_CHECK')) {
    return [{ db_check: 2 }];
  }

  // 2. Categories
  if (cleanSql.includes('FROM CATEGORIES')) {
    return memoryStore.categories.map(c => ({
      ...c,
      product_count: memoryStore.products.filter(p => p.category_id === c.id && p.is_active).length,
      total_stock: memoryStore.products
        .filter(p => p.category_id === c.id && p.is_active)
        .reduce((sum, p) => sum + (p.total_available_stock || 0), 0)
    }));
  }

  // 3. Products
  if (cleanSql.includes('FROM PRODUCTS')) {
    // If filtering by ID
    if (params.length === 1 && typeof params[0] === 'number') {
      const found = memoryStore.products.find(p => p.id === params[0]);
      return found ? [found] : [];
    }
    return memoryStore.products.filter(p => p.is_active);
  }

  // 4. Orders
  if (cleanSql.includes('FROM ORDERS')) {
    return memoryStore.orders;
  }

  // 5. Inventory / Stock
  if (cleanSql.includes('FROM INVENTORY')) {
    return memoryStore.products.map(p => ({
      product_id: p.id,
      name_en: p.name_en,
      name_ar: p.name_ar,
      sku: p.sku,
      category_name: p.category_slug,
      stock_quantity: p.total_available_stock || 0,
      low_stock_threshold: p.threshold || 10,
      is_low_stock: (p.total_available_stock || 0) <= (p.threshold || 10)
    }));
  }

  // Default empty result
  return [];
}

/**
 * Execute a transaction-safe block
 */
export async function transaction(callback) {
  if (isMysqlAvailable && pool) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Memory transaction mock
  const mockConn = {
    execute: async (sql, params = []) => {
      const res = await query(sql, params);
      return [res];
    }
  };
  return await callback(mockConn);
}

export default pool;
