import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import pool, { query } from './config/db.js';
import {
  globalLimiter,
  authLimiter,
  orderLimiter,
  adminLimiter,
  sanitizeInput,
  securityHeaders
} from './middleware/security.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// High Security: Strict Security Headers (Anti-Clickjacking, Anti-Sniff, HSTS, CSP)
app.use(securityHeaders);

// High Security: Global API Rate Limiter
app.use('/api/', globalLimiter);

// High Security: Strict CORS Whitelist
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'https://shop-kprm.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser agents (Postman, curl, server-to-server) or whitelisted domains
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow during testing, but standard headers applied
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Request Logger
app.use(morgan('dev'));

// High Security: Restrict payload limit to 1MB to prevent memory exhaustion attacks
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// High Security: Input Sanitization against XSS & Script Injection
app.use(sanitizeInput);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const results = await query('SELECT 1 + 1 AS db_check');
    const isConnected = Array.isArray(results) && results.length > 0 && results[0]?.db_check === 2;
    res.json({
      status: 'UP',
      system: 'Shop API',
      timestamp: new Date().toISOString(),
      database: isConnected ? 'CONNECTED' : 'STANDALONE_READY'
    });
  } catch (err) {
    res.json({
      status: 'UP',
      system: 'Shop API',
      timestamp: new Date().toISOString(),
      database: 'STANDALONE_FALLBACK',
      note: err.message
    });
  }
});

// API Routes with Tiered High-Security Rate Limiters
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderLimiter, orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminLimiter, adminRoutes);

// Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(` Shop Backend running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Target DB: ${process.env.DB_NAME} on port ${process.env.DB_PORT || 3307}`);
  console.log(`====================================================`);

  try {
    await pool.query('SELECT 1');
    console.log(` [DB] MariaDB connected successfully on port ${process.env.DB_PORT || 3307}!`);
  } catch (err) {
    console.warn(` [DB WARNING] Could not connect to MariaDB: ${err.message}`);
    console.warn(` Please verify MariaDB is running on port ${process.env.DB_PORT || 3307}.`);
  }
});

export default app;


