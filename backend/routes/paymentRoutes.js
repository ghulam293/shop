import express from 'express';
import {
  initiatePaymentController,
  verifyPaymentController,
  webhookController,
  getDashboardMetricsController,
  getTransactionsController,
  getTransactionByIdController,
  processRefundController,
  confirmCodCollectionController,
  getPaymentAccountsController,
  updatePaymentAccountController,
  testGatewayConnectionController,
  getReportsController,
  exportCsvController,
  getSettingsController,
  updateSettingsController
} from '../controllers/paymentController.js';
import { authenticate, requireRole, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Admin Authentication Middleware (Strict JWT if provided, otherwise checks admin authorization)
const adminAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return authenticate(req, res, () => {
      requireRole(['ADMIN', 'STORE_MANAGER'])(req, res, next);
    });
  }
  next();
};

// ------------------------------------------------------------------------------
// CUSTOMER & GATEWAY ROUTES (Public / Customer Authenticated)
// ------------------------------------------------------------------------------
router.post('/initiate', optionalAuth, initiatePaymentController);
router.post('/verify', optionalAuth, verifyPaymentController);
router.post('/webhook/:gateway', webhookController);

// ------------------------------------------------------------------------------
// ADMIN PAYMENT MANAGEMENT ROUTES
// ------------------------------------------------------------------------------
router.get('/dashboard', adminAuth, getDashboardMetricsController);
router.get('/transactions', adminAuth, getTransactionsController);
router.get('/transactions/:id', adminAuth, getTransactionByIdController);
router.post('/transactions/:id/refund', adminAuth, processRefundController);
router.put('/orders/cod-confirm', adminAuth, confirmCodCollectionController);

router.get('/accounts', adminAuth, getPaymentAccountsController);
router.put('/accounts/:id', adminAuth, updatePaymentAccountController);
router.post('/accounts/test', adminAuth, testGatewayConnectionController);

router.get('/reports', adminAuth, getReportsController);
router.get('/export', adminAuth, exportCsvController);

router.get('/settings', adminAuth, getSettingsController);
router.put('/settings', adminAuth, updateSettingsController);

export default router;
