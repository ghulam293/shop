import React, { useState, useEffect, useMemo } from 'react';
import {
  CreditCard,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  Banknote,
  Search,
  Filter,
  Download,
  ExternalLink,
  ShieldCheck,
  Settings,
  RefreshCw,
  FileText,
  Eye,
  Sliders,
  Check,
  X,
  Lock,
  Radio,
  Calendar,
  Layers,
  ArrowUpRight,
  Printer
} from 'lucide-react';
import {
  getPaymentDashboardMetrics,
  getPaymentTransactions,
  getTransactionDetails,
  processRefund,
  confirmCodCollection,
  getPaymentAccounts,
  updatePaymentAccount,
  testGatewayConnection,
  getPaymentReports,
  getPaymentSettings,
  updatePaymentSettings
} from '../../services/paymentApi.js';

export default function PaymentManagementSection({ onNavigateToOrder }) {
  // Navigation inside Payment Management
  // 'dashboard' | 'transactions' | 'accounts' | 'refunds' | 'reports' | 'settings'
  const [activeSubMenu, setActiveSubMenu] = useState('dashboard');

  // KPI Dashboard State
  const [dateFilter, setDateFilter] = useState('this_month');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [metrics, setMetrics] = useState({
    totalPayments: 3,
    totalRevenue: 59.700,
    successfulPayments: { count: 3, amount: 59.700 },
    pendingPayments: { count: 0, amount: 0.000 },
    failedPayments: { count: 0, amount: 0.000 },
    codPayments: { count: 1, amount: 14.200, paidCount: 1, pendingCount: 0 },
    refundedAmount: 0.000,
    currency: 'OMR'
  });
  const [metricsLoading, setMetricsLoading] = useState(false);

  // Transactions State
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [txPage, setTxPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [txLoading, setTxLoading] = useState(false);

  // Accounts State
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [testingGateway, setTestingGateway] = useState(false);
  const [editAccountModal, setEditAccountModal] = useState(null);

  // Reports State
  const [reports, setReports] = useState(null);

  // Settings State
  const [settings, setSettings] = useState({
    currency: 'OMR',
    currency_symbol: 'ر.ع.',
    decimal_places: 3,
    auto_settlement: true,
    invoice_prefix: 'INV-OMR-',
    min_order_amount: 1.000,
    max_order_amount: 5000.000,
    default_gateway: 'omannet',
    enable_test_cards: true
  });

  // Modals
  const [viewTxModal, setViewTxModal] = useState(null);
  const [refundModal, setRefundModal] = useState(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState(null);

  // Notification Toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load KPI Dashboard metrics
  const loadMetrics = async () => {
    setMetricsLoading(true);
    const data = await getPaymentDashboardMetrics(dateFilter, customStart, customEnd);
    if (data && data.success) {
      setMetrics(data);
    }
    setMetricsLoading(false);
  };

  // Load Transactions
  const loadTransactions = async () => {
    setTxLoading(true);
    const res = await getPaymentTransactions({
      page: txPage,
      limit: 15,
      search: searchQuery,
      status: statusFilter,
      method: methodFilter
    });
    if (res && res.transactions) {
      setTransactions(res.transactions);
      setTotalPages(res.pagination?.totalPages || 1);
    }
    setTxLoading(false);
  };

  // Load Accounts
  const loadAccounts = async () => {
    const res = await getPaymentAccounts();
    if (res && res.accounts) {
      setAccounts(res.accounts);
    }
  };

  // Load Reports
  const loadReports = async () => {
    const res = await getPaymentReports();
    if (res && res.success) {
      setReports(res);
    }
  };

  // Load Settings
  const loadSettings = async () => {
    const res = await getPaymentSettings();
    if (res && res.settings) {
      setSettings(res.settings);
    }
  };

  useEffect(() => {
    loadMetrics();
    loadTransactions();
    loadAccounts();
    loadReports();
    loadSettings();
  }, [dateFilter, customStart, customEnd]);

  useEffect(() => {
    loadTransactions();
  }, [searchQuery, statusFilter, methodFilter, txPage]);

  // Handle Refund submission
  const handleProcessRefund = async (e) => {
    e.preventDefault();
    if (!refundModal) return;
    const amount = Number(refundAmount);
    if (!amount || amount <= 0 || amount > refundModal.amount) {
      showToast('Please enter a valid refund amount up to OMR ' + refundModal.amount.toFixed(3), 'error');
      return;
    }

    setActionLoading(true);
    try {
      const res = await processRefund(refundModal.transaction_id, amount, refundReason);
      if (res && res.success) {
        showToast(`Refund of OMR ${amount.toFixed(3)} processed successfully!`);
        setRefundModal(null);
        setRefundAmount('');
        setRefundReason('');
        loadMetrics();
        loadTransactions();
      } else {
        showToast(res.message || 'Refund failed.', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Refund processing failed.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Gateway Connection Test
  const handleTestConnection = async (gatewaySlug) => {
    setTestingGateway(true);
    setTestResult(null);
    try {
      const res = await testGatewayConnection(gatewaySlug);
      setTestResult(res);
      showToast(`${res.gateway} ping: ${res.connectionStatus} (${res.latencyMs})`);
    } catch (err) {
      showToast('Gateway test connection failed.', 'error');
    } finally {
      setTestingGateway(false);
    }
  };

  // Handle Update Account
  const handleSaveAccount = async (e) => {
    e.preventDefault();
    if (!editAccountModal) return;
    setActionLoading(true);
    try {
      const res = await updatePaymentAccount(editAccountModal.id, {
        merchantId: editAccountModal.merchant_id,
        secretKey: editAccountModal.secret_key,
        environment: editAccountModal.environment,
        isActive: editAccountModal.is_active,
        callbackUrl: editAccountModal.callback_url,
        webhookUrl: editAccountModal.webhook_url
      });
      if (res && res.success) {
        showToast(`Gateway ${editAccountModal.gateway_name} updated successfully!`);
        setEditAccountModal(null);
        loadAccounts();
      }
    } catch (err) {
      showToast('Failed to update account.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    window.open('/api/payments/export', '_blank');
  };

  // Helper: Status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0', label: 'Paid' };
      case 'Pending':
        return { bg: '#fef3c7', color: '#b45309', border: '#fde68a', label: 'Pending' };
      case 'Processing':
        return { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd', label: 'Processing' };
      case 'Refunded':
        return { bg: '#fee2e2', color: '#dc2626', border: '#fecaca', label: 'Refunded' };
      case 'Partially Refunded':
        return { bg: '#ffedd5', color: '#c2410c', border: '#fed7aa', label: 'Partially Refunded' };
      case 'Failed':
      case 'Cancelled':
        return { bg: '#f3f4f6', color: '#6b7280', border: '#e5e7eb', label: status };
      default:
        return { bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb', label: status };
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.25s ease' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          backgroundColor: toast.type === 'error' ? '#ef4444' : '#10b981',
          color: '#ffffff',
          padding: '0.85rem 1.5rem',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          fontWeight: '700',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Banner & Title */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        backgroundColor: '#ffffff',
        border: '1px solid #ebdada',
        borderRadius: '14px',
        padding: '1.25rem 1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: '#fbf0f2',
            color: '#800020',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CreditCard size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#800020', margin: 0 }}>
                Payment Management System
              </h2>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: '800',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px'
              }}>
                OMR Active
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '3px 0 0' }}>
              OmanNet Debit, Visa, Mastercard, COD Gateway & Financial Settlements
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => { loadMetrics(); loadTransactions(); loadAccounts(); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 0.95rem',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              color: '#374151',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCsv}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#800020',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(128,0,32,0.2)'
            }}
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Menu Structure: Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '2px solid #f3f4f6',
        paddingBottom: '0.5rem',
        overflowX: 'auto'
      }}>
        {[
          { id: 'dashboard', label: 'Payment Dashboard', icon: TrendingUp },
          { id: 'transactions', label: `Payment Transactions (${transactions.length})`, icon: CreditCard },
          { id: 'accounts', label: `Payment Accounts (${accounts.length})`, icon: ShieldCheck },
          { id: 'refunds', label: 'Refunds', icon: RotateCcw },
          { id: 'reports', label: 'Payment Reports', icon: FileText },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeSubMenu === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubMenu(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.15rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.86rem',
                backgroundColor: active ? '#800020' : '#f9fafb',
                color: active ? '#ffffff' : '#4b5563',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 1. PAYMENT DASHBOARD VIEW */}
      {/* --------------------------------------------------------------------- */}
      {activeSubMenu === 'dashboard' && (
        <div>
          {/* Date Filters Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            backgroundColor: '#ffffff',
            padding: '0.9rem 1.25rem',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="#800020" />
              <span style={{ fontSize: '0.86rem', fontWeight: '800', color: '#1f2937' }}>
                Date Range Filter:
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                { id: 'today', label: 'Today' },
                { id: 'yesterday', label: 'Yesterday' },
                { id: 'this_week', label: 'This Week' },
                { id: 'this_month', label: 'This Month' },
                { id: 'custom', label: 'Custom' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setDateFilter(f.id)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: dateFilter === f.id ? '#800020' : '#d1d5db',
                    backgroundColor: dateFilter === f.id ? '#800020' : '#ffffff',
                    color: dateFilter === f.id ? '#ffffff' : '#374151',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {f.label}
                </button>
              ))}

              {dateFilter === 'custom' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.5rem' }}>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.8rem' }}
                  />
                  <span style={{ color: '#9ca3af' }}>to</span>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.8rem' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* KPI Statistics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.75rem'
          }}>
            {/* Total Payments */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase' }}>
                  Total Payments
                </span>
                <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.3rem', borderRadius: '8px' }}>
                  <CreditCard size={18} />
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#111827' }}>
                {metrics.totalPayments}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '4px 0 0' }}>
                All gateway & COD transactions
              </p>
            </div>

            {/* Total Revenue */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid #bbf7d0',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#15803d', textTransform: 'uppercase' }}>
                  Total Revenue
                </span>
                <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.3rem', borderRadius: '8px' }}>
                  <TrendingUp size={18} />
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#15803d' }}>
                OMR {Number(metrics.totalRevenue || 0).toFixed(3)}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#15803d', margin: '4px 0 0' }}>
                Collected & Settled Revenue
              </p>
            </div>

            {/* Successful Payments */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase' }}>
                  Successful Payments
                </span>
                <span style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '0.3rem', borderRadius: '8px' }}>
                  <CheckCircle2 size={18} />
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#111827' }}>
                {metrics.successfulPayments?.count || 0}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#059669', margin: '4px 0 0' }}>
                OMR {Number(metrics.successfulPayments?.amount || 0).toFixed(3)} verified
              </p>
            </div>

            {/* Pending Payments */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase' }}>
                  Pending Payments
                </span>
                <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '0.3rem', borderRadius: '8px' }}>
                  <Clock size={18} />
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#d97706' }}>
                {metrics.pendingPayments?.count || 0}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#b45309', margin: '4px 0 0' }}>
                OMR {Number(metrics.pendingPayments?.amount || 0).toFixed(3)} awaiting
              </p>
            </div>

            {/* Failed Payments */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase' }}>
                  Failed Payments
                </span>
                <span style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.3rem', borderRadius: '8px' }}>
                  <AlertCircle size={18} />
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#dc2626' }}>
                {metrics.failedPayments?.count || 0}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '4px 0 0' }}>
                Declined or expired gateways
              </p>
            </div>

            {/* COD Payments */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase' }}>
                  COD Payments
                </span>
                <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.3rem', borderRadius: '8px' }}>
                  <Banknote size={18} />
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#111827' }}>
                {metrics.codPayments?.count || 0}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#92400e', margin: '4px 0 0' }}>
                OMR {Number(metrics.codPayments?.amount || 0).toFixed(3)} ({metrics.codPayments?.paidCount || 0} Collected)
              </p>
            </div>

            {/* Refunded Amount */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#b91c1c', textTransform: 'uppercase' }}>
                  Refunded Amount
                </span>
                <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.3rem', borderRadius: '8px' }}>
                  <RotateCcw size={18} />
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#b91c1c' }}>
                OMR {Number(metrics.refundedAmount || 0).toFixed(3)}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#b91c1c', margin: '4px 0 0' }}>
                {metrics.refundCount || 0} processed refunds
              </p>
            </div>
          </div>

          {/* Quick Gateway Status Summary */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#111827', margin: '0 0 1rem' }}>
              Active Gateway Channels (Sultanate of Oman)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {accounts.map(acc => (
                <div key={acc.id} style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '1px solid #f3f4f6',
                  backgroundColor: '#fbfbfb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#111827' }}>
                      {acc.gateway_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                      Merchant ID: <code style={{ backgroundColor: '#f3f4f6', padding: '1px 4px', borderRadius: '4px' }}>{acc.merchant_id}</code>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '2px' }}>
                      Key: {acc.masked_key} • Env: <strong>{acc.environment}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-block',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                      backgroundColor: acc.is_active ? '#dcfce7' : '#fee2e2',
                      color: acc.is_active ? '#15803d' : '#dc2626'
                    }}>
                      {acc.is_active ? 'ACTIVE' : 'DISABLED'}
                    </span>
                    <button
                      onClick={() => handleTestConnection(acc.gateway_slug)}
                      disabled={testingGateway}
                      style={{
                        display: 'block',
                        marginTop: '0.4rem',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        color: '#800020',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Ping Gateway
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 2. PAYMENT TRANSACTIONS TABLE VIEW */}
      {/* --------------------------------------------------------------------- */}
      {(activeSubMenu === 'transactions' || activeSubMenu === 'dashboard') && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                Payment Transactions
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '3px 0 0' }}>
                Search, inspect gateway responses, invoices, and process refunds
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#9ca3af' }} />
                <input
                  type="text"
                  placeholder="Search Txn ID, Order, Customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '0.5rem 0.85rem 0.5rem 2.2rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.84rem',
                    width: '240px'
                  }}
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.84rem',
                  fontWeight: '600'
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Refunded">Refunded</option>
                <option value="Partially Refunded">Partially Refunded</option>
                <option value="Failed">Failed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {/* Method Filter */}
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.84rem',
                  fontWeight: '600'
                }}
              >
                <option value="ALL">All Methods</option>
                <option value="OMANNET">OmanNet Debit</option>
                <option value="VISA">Visa Card</option>
                <option value="MASTERCARD">Mastercard</option>
                <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb', textAlign: 'left', color: '#4b5563' }}>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Transaction ID</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Order ID</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Customer Details</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Method & Gateway</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Amount</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Gateway Ref</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Date</th>
                  <th style={{ padding: '0.75rem 0.85rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '2.5rem', color: '#9ca3af' }}>
                      No payment transactions found matching criteria.
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => {
                    const badge = getStatusBadge(t.payment_status);
                    return (
                      <tr key={t.id || t.transaction_id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' }}>
                        <td style={{ padding: '0.85rem', fontWeight: '800', color: '#800020' }}>
                          <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setViewTxModal(t)}>
                            {t.transaction_id}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem' }}>
                          <span
                            onClick={() => onNavigateToOrder && onNavigateToOrder(t.order_number)}
                            style={{ fontWeight: '700', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            {t.order_number}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem' }}>
                          <div style={{ fontWeight: '700', color: '#111827' }}>{t.customer_name}</div>
                          <div style={{ fontSize: '0.74rem', color: '#6b7280' }}>{t.customer_email} • {t.customer_phone}</div>
                        </td>
                        <td style={{ padding: '0.85rem' }}>
                          <span style={{ fontWeight: '700', color: '#1f2937' }}>
                            {t.card_brand || t.gateway_name}
                          </span>
                          {t.card_last4 && t.card_last4 !== '••••' && (
                            <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>
                              •••• {t.card_last4}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '0.85rem', fontWeight: '800', color: '#111827' }}>
                          OMR {Number(t.amount || 0).toFixed(3)}
                        </td>
                        <td style={{ padding: '0.85rem', fontSize: '0.78rem', color: '#4b5563' }}>
                          <code>{t.gateway_reference || 'N/A'}</code>
                        </td>
                        <td style={{ padding: '0.85rem' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.22rem 0.65rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            backgroundColor: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`
                          }}>
                            {badge.label}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem', fontSize: '0.78rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
                          {new Date(t.created_at).toLocaleDateString('en-GB')}
                        </td>
                        <td style={{ padding: '0.85rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                            {/* View Modal */}
                            <button
                              onClick={() => setViewTxModal(t)}
                              title="View Transaction"
                              style={{ padding: '0.35rem 0.55rem', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#ffffff', cursor: 'pointer' }}
                            >
                              <Eye size={14} color="#4b5563" />
                            </button>

                            {/* View Invoice */}
                            <button
                              onClick={() => setInvoiceModal(t)}
                              title="Download / Print Invoice"
                              style={{ padding: '0.35rem 0.55rem', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#ffffff', cursor: 'pointer' }}
                            >
                              <Printer size={14} color="#2563eb" />
                            </button>

                            {/* Process Refund (if Paid) */}
                            {t.payment_status === 'Paid' && (
                              <button
                                onClick={() => { setRefundModal(t); setRefundAmount(String(t.amount)); }}
                                title="Process Refund"
                                style={{
                                  padding: '0.35rem 0.6rem',
                                  borderRadius: '6px',
                                  border: '1px solid #fecaca',
                                  backgroundColor: '#fef2f2',
                                  color: '#dc2626',
                                  fontSize: '0.72rem',
                                  fontWeight: '700',
                                  cursor: 'pointer'
                                }}
                              >
                                Refund
                              </button>
                            )}

                            {/* Confirm COD (if COD Pending) */}
                            {t.payment_method === 'CASH_ON_DELIVERY' && t.payment_status === 'Pending' && (
                              <button
                                onClick={async () => {
                                  if (window.confirm(`Confirm cash collection of OMR ${Number(t.amount).toFixed(3)} for Order #${t.order_number}?`)) {
                                    await confirmCodCollection(t.order_number);
                                    showToast(`Cash collected and paid for #${t.order_number}!`);
                                    loadMetrics();
                                    loadTransactions();
                                  }
                                }}
                                style={{
                                  padding: '0.35rem 0.6rem',
                                  borderRadius: '6px',
                                  border: 'none',
                                  backgroundColor: '#16a34a',
                                  color: '#ffffff',
                                  fontSize: '0.72rem',
                                  fontWeight: '700',
                                  cursor: 'pointer'
                                }}
                              >
                                Collect COD
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 3. PAYMENT ACCOUNTS (GATEWAY CONFIGURATION) VIEW */}
      {/* --------------------------------------------------------------------- */}
      {activeSubMenu === 'accounts' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                Payment Gateway Accounts (OmanNet & International)
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '3px 0 0' }}>
                Manage API credentials, encryption, Sandbox/Live modes, and endpoints
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {accounts.map(acc => (
              <div
                key={acc.id}
                style={{
                  border: '1.5px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: '#fbf0f2',
                      color: '#800020',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                        {acc.gateway_name}
                      </h4>
                      <p style={{ fontSize: '0.76rem', color: '#6b7280', margin: '2px 0 0' }}>
                        {acc.notes}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      backgroundColor: acc.environment === 'Live' ? '#dcfce7' : '#fef3c7',
                      color: acc.environment === 'Live' ? '#15803d' : '#b45309'
                    }}>
                      {acc.environment} Mode
                    </span>

                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      backgroundColor: acc.is_active ? '#dcfce7' : '#fee2e2',
                      color: acc.is_active ? '#15803d' : '#dc2626'
                    }}>
                      {acc.is_active ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1rem',
                  fontSize: '0.82rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '10px',
                  padding: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <span style={{ color: '#6b7280', display: 'block', fontSize: '0.74rem' }}>Merchant ID:</span>
                    <strong style={{ color: '#111827' }}>{acc.merchant_id}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280', display: 'block', fontSize: '0.74rem' }}>API Key / Secret:</span>
                    <strong style={{ color: '#111827', fontFamily: 'monospace' }}>{acc.masked_key}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280', display: 'block', fontSize: '0.74rem' }}>Callback URL:</span>
                    <span style={{ color: '#4b5563', fontSize: '0.74rem', wordBreak: 'break-all' }}>{acc.callback_url || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280', display: 'block', fontSize: '0.74rem' }}>Webhook URL:</span>
                    <span style={{ color: '#4b5563', fontSize: '0.74rem', wordBreak: 'break-all' }}>{acc.webhook_url || 'N/A'}</span>
                  </div>
                </div>

                {/* Account Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                  <button
                    onClick={() => handleTestConnection(acc.gateway_slug)}
                    disabled={testingGateway}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 0.95rem',
                      borderRadius: '7px',
                      border: '1px solid #d1d5db',
                      backgroundColor: '#ffffff',
                      color: '#374151',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    <RefreshCw size={14} />
                    <span>Test Gateway Connection</span>
                  </button>

                  <button
                    onClick={() => setEditAccountModal(acc)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 1rem',
                      borderRadius: '7px',
                      border: 'none',
                      backgroundColor: '#800020',
                      color: '#ffffff',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    <Sliders size={14} />
                    <span>Configure Gateway</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 4. REFUNDS MANAGEMENT VIEW */}
      {/* --------------------------------------------------------------------- */}
      {activeSubMenu === 'refunds' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                Processed Refunds & Returns
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '3px 0 0' }}>
                Full and partial customer refunds with gateway reference tracking
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb', textAlign: 'left', color: '#4b5563' }}>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Refund ID</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Transaction ID</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Order #</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Refund Amount</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Gateway Ref</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Reason</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Processed At</th>
                </tr>
              </thead>
              <tbody>
                {!reports?.refundsList || reports.refundsList.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#9ca3af' }}>
                      No refund records currently logged.
                    </td>
                  </tr>
                ) : (
                  reports.refundsList.map(r => (
                    <tr key={r.id || r.refund_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.85rem', fontWeight: '800', color: '#dc2626' }}>{r.refund_id}</td>
                      <td style={{ padding: '0.85rem', fontWeight: '700', color: '#800020' }}>{r.transaction_id}</td>
                      <td style={{ padding: '0.85rem', fontWeight: '700', color: '#2563eb' }}>{r.order_number}</td>
                      <td style={{ padding: '0.85rem', fontWeight: '800', color: '#111827' }}>OMR {Number(r.refund_amount).toFixed(3)}</td>
                      <td style={{ padding: '0.85rem', fontSize: '0.78rem' }}><code>{r.gateway_reference || 'N/A'}</code></td>
                      <td style={{ padding: '0.85rem', color: '#4b5563' }}>{r.reason}</td>
                      <td style={{ padding: '0.85rem' }}>
                        <span style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: '800',
                          backgroundColor: '#fee2e2',
                          color: '#dc2626'
                        }}>
                          {r.refund_status}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem', fontSize: '0.78rem', color: '#6b7280' }}>
                        {new Date(r.created_at).toLocaleDateString('en-GB')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 5. PAYMENT REPORTS VIEW */}
      {/* --------------------------------------------------------------------- */}
      {activeSubMenu === 'reports' && (
        <div>
          {/* Method Breakdown & COD Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {/* Method Breakdown */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#111827', margin: '0 0 1rem' }}>
                Payment Method Revenue Share
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {reports?.methodBreakdown?.map(m => (
                  <div key={m.method} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid #f3f4f6' }}>
                    <div>
                      <strong style={{ color: '#111827', fontSize: '0.9rem' }}>{m.method}</strong>
                      <span style={{ fontSize: '0.74rem', color: '#6b7280', display: 'block' }}>
                        {m.count} total transactions
                      </span>
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#800020' }}>
                      OMR {Number(m.revenue || 0).toFixed(3)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cash on Delivery Collection Report */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#111827', margin: '0 0 1rem' }}>
                COD Cash Collection Report (Oman Couriers)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#4b5563' }}>Total COD Orders:</span>
                  <strong style={{ color: '#111827' }}>{reports?.codSummary?.totalCodTransactions || 0}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#15803d', fontWeight: '700' }}>Total Cash Collected:</span>
                  <strong style={{ color: '#15803d', fontSize: '1.05rem' }}>
                    OMR {Number(reports?.codSummary?.totalCodRevenue || 0).toFixed(3)}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#b45309', fontWeight: '700' }}>Awaiting Courier Handover:</span>
                  <strong style={{ color: '#b45309' }}>
                    OMR {Number(reports?.codSummary?.pendingCodCollection || 0).toFixed(3)}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Revenue Trend Table */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#111827', margin: '0 0 1rem' }}>
              Daily Payment Settlement Performance
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb', textAlign: 'left', color: '#4b5563' }}>
                  <th style={{ padding: '0.75rem' }}>Date</th>
                  <th style={{ padding: '0.75rem' }}>Total Orders</th>
                  <th style={{ padding: '0.75rem' }}>Settled Revenue</th>
                  <th style={{ padding: '0.75rem' }}>Successful</th>
                  <th style={{ padding: '0.75rem' }}>Pending</th>
                  <th style={{ padding: '0.75rem' }}>COD Share</th>
                </tr>
              </thead>
              <tbody>
                {reports?.dailyReport?.map(d => (
                  <tr key={d.date} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.85rem', fontWeight: '700', color: '#111827' }}>{d.date}</td>
                    <td style={{ padding: '0.85rem' }}>{d.totalOrders}</td>
                    <td style={{ padding: '0.85rem', fontWeight: '800', color: '#15803d' }}>OMR {Number(d.revenue).toFixed(3)}</td>
                    <td style={{ padding: '0.85rem', color: '#15803d' }}>{d.successful}</td>
                    <td style={{ padding: '0.85rem', color: '#d97706' }}>{d.pending}</td>
                    <td style={{ padding: '0.85rem', color: '#92400e' }}>OMR {Number(d.cod).toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 6. SETTINGS VIEW */}
      {/* --------------------------------------------------------------------- */}
      {activeSubMenu === 'settings' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', maxWidth: '720px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#111827', margin: '0 0 0.5rem' }}>
            Store Payment Configuration
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '0 0 1.5rem' }}>
            National currency parameters, invoice numbering, and settlement controls
          </p>

          <form onSubmit={async (e) => {
            e.preventDefault();
            await updatePaymentSettings(settings);
            showToast('Payment system settings updated successfully!');
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#374151', marginBottom: '0.4rem' }}>
                  Base Currency
                </label>
                <input
                  type="text"
                  value={`${settings.currency} (Omani Rial - ${settings.currency_symbol})`}
                  disabled
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '7px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', fontWeight: '700' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#374151', marginBottom: '0.4rem' }}>
                  Invoice Number Prefix
                </label>
                <input
                  type="text"
                  value={settings.invoice_prefix || 'INV-OMR-'}
                  onChange={(e) => setSettings({ ...settings, invoice_prefix: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '7px', border: '1px solid #d1d5db' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#374151', marginBottom: '0.4rem' }}>
                    Minimum Order Amount (OMR)
                  </label>
                  <input
                    type="number"
                    step="0.100"
                    value={settings.min_order_amount}
                    onChange={(e) => setSettings({ ...settings, min_order_amount: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '7px', border: '1px solid #d1d5db' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#374151', marginBottom: '0.4rem' }}>
                    Maximum Order Amount (OMR)
                  </label>
                  <input
                    type="number"
                    step="10.000"
                    value={settings.max_order_amount}
                    onChange={(e) => setSettings({ ...settings, max_order_amount: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '7px', border: '1px solid #d1d5db' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="auto_settlement"
                  checked={settings.auto_settlement}
                  onChange={(e) => setSettings({ ...settings, auto_settlement: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#800020' }}
                />
                <label htmlFor="auto_settlement" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827', cursor: 'pointer' }}>
                  Enable automatic daily merchant settlement to store bank account
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <input
                  type="checkbox"
                  id="enable_test_cards"
                  checked={settings.enable_test_cards}
                  onChange={(e) => setSettings({ ...settings, enable_test_cards: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#800020' }}
                />
                <label htmlFor="enable_test_cards" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827', cursor: 'pointer' }}>
                  Accept test cards for OmanNet and Visa 3D-Secure simulation
                </label>
              </div>

              <button
                type="submit"
                style={{
                  alignSelf: 'flex-start',
                  marginTop: '0.5rem',
                  padding: '0.65rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#800020',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.86rem',
                  cursor: 'pointer'
                }}
              >
                Save Payment Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 1: VIEW TRANSACTION DETAILS */}
      {/* --------------------------------------------------------------------- */}
      {viewTxModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            maxWidth: '560px',
            width: '100%',
            padding: '1.75rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#800020', margin: 0 }}>
                Transaction #{viewTxModal.transaction_id}
              </h3>
              <button onClick={() => setViewTxModal(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.86rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#6b7280' }}>Order Reference:</span>
                <strong style={{ color: '#2563eb' }}>{viewTxModal.order_number}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#6b7280' }}>Customer:</span>
                <strong style={{ color: '#111827' }}>{viewTxModal.customer_name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#6b7280' }}>Contact Info:</span>
                <span>{viewTxModal.customer_email} • {viewTxModal.customer_phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#6b7280' }}>Amount:</span>
                <strong style={{ color: '#15803d', fontSize: '1rem' }}>OMR {Number(viewTxModal.amount).toFixed(3)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#6b7280' }}>Payment Channel:</span>
                <strong>{viewTxModal.payment_method} ({viewTxModal.gateway_name})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#6b7280' }}>Gateway Reference:</span>
                <code>{viewTxModal.gateway_reference || 'N/A'}</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#6b7280' }}>Gateway Response:</span>
                <code style={{ fontSize: '0.74rem' }}>{viewTxModal.gateway_response_reference || 'Awaiting response'}</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#6b7280' }}>Payment Status:</span>
                <span style={{ fontWeight: '800', color: viewTxModal.payment_status === 'Paid' ? '#15803d' : '#b45309' }}>
                  {viewTxModal.payment_status}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Created At:</span>
                <span>{new Date(viewTxModal.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => { setInvoiceModal(viewTxModal); setViewTxModal(null); }}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Print Invoice
              </button>
              <button
                onClick={() => setViewTxModal(null)}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#800020',
                  color: '#ffffff',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 2: PROCESS REFUND */}
      {/* --------------------------------------------------------------------- */}
      {refundModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            maxWidth: '480px',
            width: '100%',
            padding: '1.75rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RotateCcw size={22} color="#dc2626" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#dc2626', margin: 0 }}>
                  Process Refund
                </h3>
              </div>
              <button onClick={() => setRefundModal(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#4b5563', marginBottom: '1.25rem' }}>
              Issue a full or partial refund to customer <strong>{refundModal.customer_name}</strong> for Order #{refundModal.order_number}.
            </p>

            <form onSubmit={handleProcessRefund}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>
                    Refund Amount (OMR) - Max: OMR {Number(refundModal.amount).toFixed(3)}
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    max={refundModal.amount}
                    min="0.001"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '7px', border: '1.5px solid #d1d5db', fontSize: '1rem', fontWeight: '800' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>
                    Reason for Refund
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Size exchange returned, defective item, customer cancellation"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '7px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button
                  type="button"
                  onClick={() => setRefundModal(null)}
                  style={{ padding: '0.6rem 1.15rem', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: '#ffffff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {actionLoading ? 'Processing...' : 'Confirm Refund'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 3: CONFIGURE GATEWAY ACCOUNT */}
      {/* --------------------------------------------------------------------- */}
      {editAccountModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            maxWidth: '540px',
            width: '100%',
            padding: '1.75rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#800020', margin: 0 }}>
                Configure {editAccountModal.gateway_name}
              </h3>
              <button onClick={() => setEditAccountModal(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAccount}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.35rem' }}>Merchant ID</label>
                  <input
                    type="text"
                    value={editAccountModal.merchant_id}
                    onChange={(e) => setEditAccountModal({ ...editAccountModal, merchant_id: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '7px', border: '1px solid #d1d5db' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.35rem' }}>
                    New API Secret Key (Leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new secret key to update"
                    value={editAccountModal.secret_key || ''}
                    onChange={(e) => setEditAccountModal({ ...editAccountModal, secret_key: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '7px', border: '1px solid #d1d5db' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.35rem' }}>Environment</label>
                    <select
                      value={editAccountModal.environment}
                      onChange={(e) => setEditAccountModal({ ...editAccountModal, environment: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '7px', border: '1px solid #d1d5db' }}
                    >
                      <option value="Sandbox">Sandbox (Test)</option>
                      <option value="Live">Live (Production)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.35rem' }}>Gateway Status</label>
                    <select
                      value={editAccountModal.is_active ? '1' : '0'}
                      onChange={(e) => setEditAccountModal({ ...editAccountModal, is_active: e.target.value === '1' })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '7px', border: '1px solid #d1d5db' }}
                    >
                      <option value="1">Enabled</option>
                      <option value="0">Disabled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.35rem' }}>Callback URL</label>
                  <input
                    type="text"
                    value={editAccountModal.callback_url || ''}
                    onChange={(e) => setEditAccountModal({ ...editAccountModal, callback_url: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '7px', border: '1px solid #d1d5db' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.35rem' }}>Webhook URL</label>
                  <input
                    type="text"
                    value={editAccountModal.webhook_url || ''}
                    onChange={(e) => setEditAccountModal({ ...editAccountModal, webhook_url: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '7px', border: '1px solid #d1d5db' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button
                  type="button"
                  onClick={() => setEditAccountModal(null)}
                  style={{ padding: '0.6rem 1.15rem', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: '#ffffff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#800020',
                    color: '#ffffff',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Save Gateway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 4: INVOICE PRINT PREVIEW */}
      {/* --------------------------------------------------------------------- */}
      {invoiceModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            maxWidth: '600px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #800020', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#800020', margin: 0 }}>
                  OFFICIAL TAX INVOICE
                </h2>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                  School Uniform & Educational Store (Salalah, Sultanate of Oman)
                </div>
              </div>
              <button onClick={() => setInvoiceModal(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.84rem', marginBottom: '1.5rem' }}>
              <div>
                <strong style={{ display: 'block', color: '#111827' }}>Billed To:</strong>
                <div>{invoiceModal.customer_name}</div>
                <div>{invoiceModal.customer_phone}</div>
                <div>{invoiceModal.customer_email}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div><strong>Invoice #:</strong> INV-OMR-{invoiceModal.order_number}</div>
                <div><strong>Txn Ref:</strong> {invoiceModal.transaction_id}</div>
                <div><strong>Date:</strong> {new Date(invoiceModal.created_at).toLocaleDateString('en-GB')}</div>
                <div><strong>Gateway:</strong> {invoiceModal.gateway_name}</div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', marginBottom: '1.5rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>Description</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Amount (OMR)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.65rem 0.5rem' }}>
                    Store Order Fulfillment #{invoiceModal.order_number} ({invoiceModal.payment_method})
                  </td>
                  <td style={{ padding: '0.65rem 0.5rem', textAlign: 'right', fontWeight: '800' }}>
                    OMR {Number(invoiceModal.amount).toFixed(3)}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: '800', textAlign: 'right' }}>Total Paid:</td>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: '900', color: '#800020', textAlign: 'right', fontSize: '1.1rem' }}>
                    OMR {Number(invoiceModal.amount).toFixed(3)}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div style={{
              backgroundColor: '#f9fafb',
              padding: '0.85rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#6b7280',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              Payment status: <strong>{invoiceModal.payment_status}</strong> • Verified gateway response: {invoiceModal.gateway_reference || 'N/A'}. Thank you for your purchase!
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
              <button
                onClick={() => window.print()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#800020',
                  color: '#ffffff',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <Printer size={16} />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setInvoiceModal(null)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
