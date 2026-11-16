import express from 'express';
import { createOrder, getMyOrders, getOrderById, trackOrderByNumber } from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public Order Tracking Endpoint (no login needed)
router.get('/track/:reference', trackOrderByNumber);

// Authenticated Routes
router.use(authenticate);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);

export default router;
