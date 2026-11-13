import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import pool, { query } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS setup for Web and Capacitor Android app
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost',
  'capacitor://localhost',
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow during local school testing
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Request logger
app.use(morgan('dev'));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting for Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per window
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const [dbRes] = await query('SELECT 1 + 1 AS db_check');
    res.json({
      status: 'UP',
      system: 'Shop API',
      timestamp: new Date().toISOString(),
      database: dbRes.db_check === 2 ? 'CONNECTED' : 'UNKNOWN'
    });
  } catch (err) {
    res.status(500).json({
      status: 'DEGRADED',
      database: 'DISCONNECTED',
      error: err.message
    });
  }
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

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

