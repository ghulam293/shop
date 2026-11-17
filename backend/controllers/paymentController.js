import {
  initiatePayment,
  verifyPayment,
  confirmCodCollection,
  processRefund,
  getPaymentDashboardMetrics,
  getTransactions,
  getPaymentAccounts,
  updatePaymentAccount,
  testGatewayConnection,
  generatePaymentReports,
  exportTransactionsToCsv,
  logWebhook,
  logPaymentAudit
} from '../services/paymentService.js';
import { memoryStore } from '../config/db.js';
import { verifyWebhookSignature } from '../services/paymentEncryption.js';

/**
 * CUSTOMER: Initiate payment transaction (Card / OmanNet / COD)
 */
export async function initiatePaymentController(req, res, next) {
  try {
    const {
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      items,
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      fulfillmentMethod
    } = req.body;

    if (!totalAmount || Number(totalAmount) <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid payment amount.' });
    }

    const session = await initiatePayment({
      orderNumber,
      customerName: customerName || req.user?.fullName,
      customerEmail: customerEmail || req.user?.email,
      customerPhone: customerPhone || req.user?.phoneNumber || req.user?.phone,
      items,
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      fulfillmentMethod,
      userId: req.user?.id || null
    });

    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
}

/**
 * CUSTOMER / GATEWAY: Server-side payment verification
 */
export async function verifyPaymentController(req, res, next) {
  try {
    const { transactionId, gatewayReference, cardLast4, cardBrand } = req.body;

    if (!transactionId) {
      return res.status(400).json({ success: false, message: 'Transaction ID is required for verification.' });
    }

    const result = await verifyPayment({
      transactionId,
      gatewayReference,
      cardLast4,
      cardBrand,
      adminEmail: req.user?.email || null
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * GATEWAY WEBHOOK: Authenticate signature and process asynchronous event
 */
export async function webhookController(req, res, next) {
  const { gateway } = req.params;
  const signature = req.headers['x-signature'] || req.headers['x-webhook-signature'] || '';
  const payload = req.body;

  try {
    // Locate account
    const account = (memoryStore.payment_accounts || []).find(a => a.gateway_slug === gateway);
    const secret = account ? account.encrypted_credentials : null;

    // Verify signature if provided (or log)
    const isValid = signature ? verifyWebhookSignature(payload, signature, secret) : true;

    const eventId = payload.event_id || `EVT-${Date.now()}`;
    const transactionId = payload.transaction_id || payload.txn_id || null;
    const eventType = payload.event_type || 'PAYMENT_CAPTURED';

    await logWebhook({
      gatewayName: account ? account.gateway_name : gateway,
      eventId,
      transactionId,
      eventType,
      processingStatus: isValid ? 'SUCCESS' : 'SIGNATURE_FAILED',
      payload,
      signature
    });

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid webhook signature.' });
    }

    // If event is payment success, automatically verify transaction
    if (transactionId && (eventType === 'PAYMENT_CAPTURED' || eventType === 'CHARGE_SUCCESS')) {
      await verifyPayment({
        transactionId,
        gatewayReference: payload.gateway_reference || `${gateway.toUpperCase()}-WEBHOOK-${Date.now()}`,
        cardLast4: payload.card_last4 || null,
        cardBrand: payload.card_brand || null
      });
    }

    res.json({ success: true, message: 'Webhook received and processed.' });
  } catch (error) {
    next(error);
  }
}

/**
 * ADMIN: Get payment dashboard KPI statistics (Total, Revenue, Successful, Pending, COD, Refunds)
 */
export async function getDashboardMetricsController(req, res, next) {
  try {
    const { dateFilter, startDate, endDate } = req.query;
    const metrics = await getPaymentDashboardMetrics({
      dateFilter: dateFilter || 'this_month',
      customStartDate: startDate,
      customEndDate: endDate
    });
    res.json({ success: true, ...metrics });
  } catch (error) {
    next(error);
  }
}

/**
 * ADMIN: Get payment transactions table with search, filters, and pagination
 */
export async function getTransactionsController(req, res, next) {
  try {
    const { page, limit, search, status, method, startDate, endDate } = req.query;
    const result = await getTransactions({
      page,
      limit,
      search,
      status,
      method,
      startDate,
      endDate
    });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

/**
 * ADMIN: Get single transaction details by ID
 */
export async function getTransactionByIdController(req, res, next) {
  try {
    const { id } = req.params;
    const txn = (memoryStore.payment_transactions || []).find(
      t => String(t.id) === String(id) || t.transaction_id === id
    );

    if (!txn) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }

    const refunds = (memoryStore.refunds || []).filter(r => r.transaction_id === txn.transaction_id);
    const audits = (memoryStore.payment_audit_logs || []).filter(a => a.transaction_id === txn.transaction_id);

    res.json({
      success: true,
      transaction: txn,
      refunds,
      auditHistory: audits
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ADMIN: Process Refund (Full or Partial)
 */
export async function processRefundController(req, res, next) {
  try {
    const { id } = req.params;
    const { refundAmount, reason } = req.body;

    const txn = (memoryStore.payment_transactions || []).find(
      t => String(t.id) === String(id) || t.transaction_id === id
    );

    if (!txn) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }

    const result = await processRefund({
      transactionId: txn.transaction_id,
      refundAmount,
      reason,
      adminId: req.user?.id || 1,
      adminEmail: req.user?.email || 'admin@shop.com'
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * ADMIN: Confirm Cash on Delivery collection
 */
export async function confirmCodCollectionController(req, res, next) {
  try {
    const { orderNumber } = req.body;
    if (!orderNumber) {
      return res.status(400).json({ success: false, message: 'Order number is required.' });
    }

    const result = await confirmCodCollection({
      orderNumber,
      adminId: req.user?.id || 1,
      adminEmail: req.user?.email || 'admin@shop.com'
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * ADMIN: Get configured payment gateway accounts
 */
export async function getPaymentAccountsController(req, res, next) {
  try {
    const accounts = await getPaymentAccounts();
    res.json({ success: true, accounts });
  } catch (error) {
    next(error);
  }
}

/**
 * ADMIN: Update gateway account credentials / settings
 */
export async function updatePaymentAccountController(req, res, next) {
  try {
    const { id } = req.params;
    const { merchantId, secretKey, environment, isActive, callbackUrl, webhookUrl, notes } = req.body;

    const result = await updatePaymentAccount(id, {
      merchantId,
      secretKey,
      environment,
      isActive,
      callbackUrl,
      webhookUrl,
      notes
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * ADMIN: Test gateway connection / health ping
 */
export async function testGatewayConnectionController(req, res, next) {
  try {
    const { gatewaySlug } = req.body;
    if (!gatewaySlug) {
      return res.status(400).json({ success: false, message: 'gatewaySlug is required.' });
    }

    const result = await testGatewayConnection(gatewaySlug);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * ADMIN: Get Payment Reports & COD Collection summaries
 */
export async function getReportsController(req, res, next) {
  try {
    const reports = await generatePaymentReports();
    res.json({ success: true, ...reports });
  } catch (error) {
    next(error);
  }
}

/**
 * ADMIN: Export filtered transactions to CSV
 */
export async function exportCsvController(req, res, next) {
  try {
    const transactions = memoryStore.payment_transactions || [];
    const csvData = exportTransactionsToCsv(transactions);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=transactions_export_${Date.now()}.csv`);
    res.status(200).send(csvData);
  } catch (error) {
    next(error);
  }
}

/**
 * ADMIN: Get & Update Payment Settings
 */
export async function getSettingsController(req, res) {
  res.json({ success: true, settings: memoryStore.payment_settings || {} });
}

export async function updateSettingsController(req, res) {
  const { minOrderAmount, maxOrderAmount, invoicePrefix, defaultGateway, enableTestCards } = req.body;
  if (!memoryStore.payment_settings) memoryStore.payment_settings = {};

  if (minOrderAmount !== undefined) memoryStore.payment_settings.min_order_amount = Number(minOrderAmount);
  if (maxOrderAmount !== undefined) memoryStore.payment_settings.max_order_amount = Number(maxOrderAmount);
  if (invoicePrefix !== undefined) memoryStore.payment_settings.invoice_prefix = invoicePrefix;
  if (defaultGateway !== undefined) memoryStore.payment_settings.default_gateway = defaultGateway;
  if (enableTestCards !== undefined) memoryStore.payment_settings.enable_test_cards = !!enableTestCards;

  await logPaymentAudit({
    action: 'PAYMENT_SETTINGS_UPDATED',
    description: `Admin updated payment system configuration.`
  });

  res.json({ success: true, message: 'Payment settings updated successfully.', settings: memoryStore.payment_settings });
}
