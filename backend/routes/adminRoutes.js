import express from 'express';
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getInventory,
  updateStock
} from '../controllers/adminController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Restrict all routes to ADMIN and STAFF
router.use(authenticate);
router.use(requireRole(['ADMIN', 'STAFF']));

router.get('/stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/inventory', getInventory);
router.put('/inventory/:variantId', updateStock);

export default router;

