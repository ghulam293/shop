import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  Edit2,
  Save,
  LogOut,
  Search,
  Filter,
  DollarSign,
  ArrowUpRight,
  RefreshCw,
  Plus,
  Download,
  CreditCard,
  Banknote,
  Eye,
  Store,
  Trash2,
  X,
  Grid,
  Layers,
  Sparkles,
  Check,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';
import { useCart } from '../context/CartContext.js';
import {
  getCatalogProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  resetCatalogToDefault,
  OFFICIAL_CATEGORIES
} from '../services/productStore.js';
import api from '../services/api.js';
import {
  getRegisteredCustomers,
  addRegisteredCustomer,
  updateCustomerStatus,
  deleteCustomer
} from '../services/customerStore.js';
import {
  getAllStoreOrders,
  addNewCustomerOrder,
  updateOrderStatusInStore,
  deleteOrderFromStore
} from '../services/orderStore.js';

export default function AdminDashboardPage() {
  const { user, isAdmin, login, logout } = useAuth();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  // ACCESS CONTROL GUARD: Block non-admin accounts (Customer / Unauthenticated)
  if (!isAdmin) {
    return (
      <div style={{ minHeight: '82vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1rem', backgroundColor: '#faf9f6' }}>
        <div style={{
          maxWidth: '540px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1.5px solid #ebdada',
          padding: '2.75rem 2.25rem',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(158, 42, 43, 0.08)'
        }}>
          {/* Lock / Shield Icon */}
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            backgroundColor: '#fdf2f4',
            border: '2px solid #f0d5db',
            color: '#9E2A2B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <ShieldAlert size={34} color="#9E2A2B" />
          </div>

          <span style={{
            display: 'inline-block',
            fontSize: '0.74rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#9E2A2B',
            backgroundColor: '#fdf2f4',
            border: '1px solid #ebdada',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            marginBottom: '0.9rem'
          }}>
            {isRTL ? 'منطقة محظورة — تسجيل دخول المسؤول مطلوب' : 'Admin Login Required'}
          </span>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#111827', margin: '0 0 0.65rem' }}>
            {isRTL ? 'لوحة تحكم المسؤول محمية' : 'Admin Dashboard Protected'}
          </h2>

          <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6', margin: '0 0 1.75rem' }}>
            {user ? (
              isRTL
                ? `أنت مسجل حالياً كحساب زبون (${user.fullName || user.email}). لوحة إدارة المتجر مخصصة فقط للمسؤولين المعتمدين.`
                : `You are currently signed in with a Customer account (${user.fullName || user.email}). Customer logins cannot view or access the store administration dashboard.`
            ) : (
              isRTL
                ? 'لوحة إدارة المتجر مخصصة للمسؤولين المعتمدين فقط. يرجى تسجيل الدخول بحساب مسؤول للمتابعة.'
                : 'This management dashboard is restricted to authorized store administrators. Please sign in with an Administrator account.'
            )}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Quick 1-Click Login as Admin */}
            <button
              onClick={async () => {
                await login('admin@shop.com', 'admin123');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: '#9E2A2B',
                color: '#ffffff',
                border: 'none',
                padding: '0.85rem 1.25rem',
                borderRadius: '10px',
                fontWeight: '800',
                fontSize: '0.92rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(158, 42, 43, 0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              <ShieldAlert size={18} />
              <span>{isRTL ? '⚡ دخول فوري كمسؤول (حساب تجريبي)' : '⚡ 1-Click Login as Administrator'}</span>
            </button>

            {/* Go to Login Page */}
            <button
              onClick={() => navigate('/login', { state: { activeTab: 'admin' } })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc',
                color: '#334155',
                border: '1px solid #cbd5e1',
                padding: '0.75rem 1.25rem',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.86rem',
                cursor: 'pointer'
              }}
            >
              {isRTL ? 'الذهاب إلى بوابة تسجيل الدخول' : 'Go to Login Portal'}
            </button>

            {/* Back to Home / Catalog */}
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9E2A2B',
                padding: '0.5rem',
                fontWeight: '700',
                fontSize: '0.85rem',
                textDecoration: 'none'
              }}
            >
              {isRTL ? '← العودة إلى المتجر' : '← Return to Store Home'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { getAllCustomerCarts } = useCart();
  const [activeTab, setActiveTab] = useState('overview');
  const [customerCarts, setCustomerCarts] = useState([]);

  useEffect(() => {
    if (isAdmin && getAllCustomerCarts) {
      setCustomerCarts(getAllCustomerCarts());
    }
  }, [isAdmin, getAllCustomerCarts, activeTab]);

  const [orderFilter, setOrderFilter] = useState('ALL');
  const [orderSearch, setOrderSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('7d');

  // Persistent, reactive order store integration
  const [orders, setOrders] = useState(() => getAllStoreOrders());

  useEffect(() => {
    const handleOrdersUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setOrders(e.detail);
      } else {
        setOrders(getAllStoreOrders());
      }
    };
    window.addEventListener('shop-orders-updated', handleOrdersUpdate);

    // Also fetch from backend API if connected
    api.get('/admin/orders')
      .then(res => {
        if (res.data && res.data.success && Array.isArray(res.data.orders)) {
          const local = getAllStoreOrders();
          const map = new Map();
          local.forEach(o => map.set(o.orderNumber, o));
          res.data.orders.forEach(o => {
            const num = o.orderNumber || o.order_number;
            if (!map.has(num)) {
              map.set(num, o);
            }
          });
          setOrders(Array.from(map.values()));
        }
      })
      .catch(() => {});

    return () => window.removeEventListener('shop-orders-updated', handleOrdersUpdate);
  }, []);

  // Persistent catalog store integration
  const [catalogProducts, setCatalogProducts] = useState(() => getCatalogProducts());

  useEffect(() => {
    const handleUpdate = () => {
      setCatalogProducts(getCatalogProducts());
    };
    window.addEventListener('ips-products-updated', handleUpdate);
    return () => window.removeEventListener('ips-products-updated', handleUpdate);
  }, []);

  // Modals & Feedback State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (text, type = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Add Product Form State
  const [newProductForm, setNewProductForm] = useState({
    nameEn: '',
    nameAr: '',
    category: 'school-uniforms',
    price: '7.500',
    sizes: 'XS, S, M, L, XL',
    stock: 50,
    threshold: 10,
    sku: '',
    image: '/products/polo-shirt-front.jpg',
    descEn: '',
    descAr: ''
  });

  const handleOpenEdit = (prod) => {
    setEditingProduct({
      id: prod.id,
      nameEn: prod.nameEn || '',
      nameAr: prod.nameAr || '',
      category: prod.category || 'school-uniforms',
      price: prod.price !== undefined ? prod.price : 1.000,
      sizes: Array.isArray(prod.sizes) ? prod.sizes.join(', ') : (prod.sizes || 'Standard'),
      stock: prod.stock !== undefined ? prod.stock : 25,
      threshold: prod.threshold !== undefined ? prod.threshold : 5,
      sku: prod.sku || '',
      image: prod.image || '/products/polo-shirt-front.jpg',
      descEn: prod.descEn || '',
      descAr: prod.descAr || ''
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    const updated = updateProduct(editingProduct.id, {
      nameEn: editingProduct.nameEn,
      nameAr: editingProduct.nameAr,
      category: editingProduct.category,
      price: parseFloat(editingProduct.price) || 0,
      sizes: editingProduct.sizes,
      stock: parseInt(editingProduct.stock, 10) || 0,
      threshold: parseInt(editingProduct.threshold, 10) || 5,
      sku: editingProduct.sku,
      image: editingProduct.image,
      descEn: editingProduct.descEn,
      descAr: editingProduct.descAr
    });
    setEditingProduct(null);
    showFeedback(`Product "${updated.nameEn}" updated! Price set to OMR ${updated.price.toFixed(3)}.`);
  };

  const handleDelete = (prod) => {
    if (window.confirm(`Are you sure you want to delete "${prod.nameEn}" from the shop? This will immediately remove it from all store pages.`)) {
      deleteProduct(prod.id);
      showFeedback(`Product "${prod.nameEn}" has been removed from the shop.`);
    }
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProductForm.nameEn.trim()) {
      alert('Please enter a product name in English.');
      return;
    }
    const created = addProduct({
      ...newProductForm,
      price: parseFloat(newProductForm.price) || 1.000,
      stock: parseInt(newProductForm.stock, 10) || 20,
      threshold: parseInt(newProductForm.threshold, 10) || 5
    });
    setIsAddModalOpen(false);
    setNewProductForm({
      nameEn: '',
      nameAr: '',
      category: 'school-uniforms',
      price: '7.500',
      sizes: 'XS, S, M, L, XL',
      stock: 50,
      threshold: 10,
      sku: '',
      image: '/products/polo-shirt-front.jpg',
      descEn: '',
      descAr: ''
    });
    showFeedback(`New product "${created.nameEn}" added to shop catalog!`);
  };

  const handleResetCatalog = () => {
    if (window.confirm('Restore shop catalog, prices, and sizes back to default proposal items? Any custom products will be reset.')) {
      resetCatalogToDefault();
      showFeedback('Shop catalog restored to default proposal items.');
    }
  };

  // Customer Directory State (reactive with persistent store)
  const [customers, setCustomers] = useState(() => getRegisteredCustomers());
  const [customerSearch, setCustomerSearch] = useState('');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active'
  });

  // Keep customers synced in real-time when a new customer registers anywhere
  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCustomers(e.detail);
      } else {
        setCustomers(getRegisteredCustomers());
      }
    };
    window.addEventListener('shop-customers-updated', handleUpdate);

    // Try fetching from backend API
    api.get('/admin/customers')
      .then(res => {
        if (res.data && res.data.success && Array.isArray(res.data.customers)) {
          const local = getRegisteredCustomers();
          const emailMap = new Map();
          local.forEach(c => emailMap.set((c.email || '').toLowerCase().trim(), c));
          res.data.customers.forEach(c => {
            const clean = (c.email || '').toLowerCase().trim();
            if (!emailMap.has(clean)) {
              emailMap.set(clean, c);
            }
          });
          const merged = Array.from(emailMap.values());
          setCustomers(merged);
        }
      })
      .catch(() => {});

    return () => window.removeEventListener('shop-customers-updated', handleUpdate);
  }, []);

  const handleCreateCustomerSubmit = async (e) => {
    e.preventDefault();
    if (!newCustomer.name.trim() || !newCustomer.email.trim()) {
      showFeedback('Customer name and email are required.', 'error');
      return;
    }

    const createdList = addRegisteredCustomer({
      name: newCustomer.name.trim(),
      email: newCustomer.email.trim().toLowerCase(),
      phone: newCustomer.phone.trim() || '+968 90 000000',
      status: newCustomer.status || 'Active',
      ordersCount: 0,
      totalSpend: '0.000',
      joinedDate: 'Just now'
    });

    setCustomers(createdList);

    // Also notify backend API
    try {
      await api.post('/admin/customers', {
        name: newCustomer.name.trim(),
        email: newCustomer.email.trim().toLowerCase(),
        phone: newCustomer.phone.trim() || '+968 90 000000',
        status: newCustomer.status || 'Active'
      });
    } catch (_) {}

    showFeedback(`Customer account for "${newCustomer.name}" created successfully!`);
    setShowAddCustomerModal(false);
    setNewCustomer({ name: '', email: '', phone: '', status: 'Active' });
  };

  const handleToggleCustomerStatus = (cust) => {
    const nextStatus = cust.status === 'Active' ? 'Blocked' : 'Active';
    const updated = updateCustomerStatus(cust.id, nextStatus);
    setCustomers(updated);
    showFeedback(`Customer "${cust.name}" status updated to ${nextStatus}.`);
  };

  const handleDeleteCustomer = (cust) => {
    if (window.confirm(`Are you sure you want to delete customer account "${cust.name}"?`)) {
      const updated = deleteCustomer(cust.id);
      setCustomers(updated);
      showFeedback(`Customer "${cust.name}" removed.`);
    }
  };

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers;
    const q = customerSearch.toLowerCase().trim();
    return customers.filter(c =>
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q)
    );
  }, [customers, customerSearch]);

  const [exportNotice, setExportNotice] = useState(false);

  const handleUpdateStatus = (orderId, newStatus) => {
    const updated = updateOrderStatusInStore(orderId, newStatus);
    setOrders(updated);
    showFeedback(`Order status updated to ${newStatus}.`);
    try {
      api.put(`/admin/orders/${orderId}/status`, { status: newStatus }).catch(() => {});
    } catch (_) {}
  };

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 2500);
  };

  // Metrics
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0).toFixed(3);
  }, [orders]);

  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING').length;
  const readyOrdersCount = orders.filter(o => o.status === 'READY_FOR_PICKUP').length;
  const lowStockItems = catalogProducts.filter(i => (i.stock || 0) <= (i.threshold || 5));

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (orderFilter !== 'ALL' && o.status !== orderFilter) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q)
        );
      }
      return true;
    });
  }, [orders, orderFilter, orderSearch]);

  // Filtered catalog products for inventory manager
  const filteredCatalog = useMemo(() => {
    return catalogProducts.filter(item => {
      if (inventoryFilter === 'LOW' && (item.stock || 0) > (item.threshold || 5)) return false;
      if (inventoryFilter !== 'ALL' && inventoryFilter !== 'LOW' && item.category !== inventoryFilter) return false;
      if (inventorySearch.trim()) {
        const q = inventorySearch.toLowerCase();
        return (
          (item.nameEn && item.nameEn.toLowerCase().includes(q)) ||
          (item.nameAr && item.nameAr.toLowerCase().includes(q)) ||
          (item.sku && item.sku.toLowerCase().includes(q)) ||
          (item.category && item.category.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [catalogProducts, inventoryFilter, inventorySearch]);

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: 'calc(100vh - 120px)', padding: '2rem 1.25rem 4rem' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Top Executive Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
          backgroundColor: '#ffffff',
          padding: '1.25rem 1.75rem',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              backgroundColor: '#800020',
              color: '#ffffff',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(128, 0, 32, 0.25)'
            }}>
              <ShieldAlert size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#800020', margin: 0 }}>
                  Shop Executive Dashboard
                </h1>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  color: '#16a34a',
                  backgroundColor: '#dcfce7',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px'
                }}>
                  Live Store Active
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '3px 0 0' }}>
                Store Administration & Order Fulfillment • Admin: <strong>{user?.email || 'admin@shop.com'}</strong>
              </p>
            </div>
          </div>

          {/* Quick Global Action Buttons */}
          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1rem',
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                color: '#374151',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: '700',
                textDecoration: 'none'
              }}
            >
              <Store size={16} />
              <span>View Store</span>
            </Link>

            <button
              onClick={handleExport}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1rem',
                backgroundColor: '#800020',
                border: 'none',
                color: '#ffffff',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Download size={16} />
              <span>{exportNotice ? 'Exported!' : 'Export Reports'}</span>
            </button>

            <button
              onClick={() => { logout(); navigate('/login'); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 0.95rem',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fee2e2',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Pill Bar */}
        <div style={{
          display: 'flex',
          gap: '0.6rem',
          marginBottom: '2rem',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '0.6rem',
          overflowX: 'auto'
        }}>
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
            { id: 'orders', label: `Manage Orders (${orders.length})`, icon: ShoppingCart },
            { id: 'inventory', label: `Products & Catalog (${catalogProducts.length})`, icon: Package },
            { id: 'categories', label: `Category Controls (${OFFICIAL_CATEGORIES.length})`, icon: Grid },
            { id: 'customer_carts', label: `Active Customer Carts (${customerCarts.length})`, icon: ShoppingBag },
            { id: 'customers', label: `Customer Accounts (${customers.length})`, icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.35rem',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: active ? '#800020' : '#ffffff',
                  color: active ? '#ffffff' : '#4b5563',
                  boxShadow: active ? '0 4px 12px rgba(128,0,32,0.2)' : '0 1px 3px rgba(0,0,0,0.03)',
                  transition: 'all 0.18s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={17} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: EXECUTIVE OVERVIEW & VISUAL ANALYTICS                   */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div>
            {/* 4 Core Metric KPI Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem'
            }}>
              
              {/* Metric 1: Total Revenue */}
              <div style={{
                backgroundColor: '#ffffff',
                padding: '1.4rem',
                borderRadius: '14px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase' }}>Total Revenue</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#fdf2f4', color: '#800020', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarSign size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#800020', margin: '0.4rem 0 0.2rem' }}>
                  OMR {totalRevenue}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.76rem', color: '#16a34a', fontWeight: '700' }}>
                  <ArrowUpRight size={15} />
                  <span>+18.4% this week</span>
                </div>
              </div>

              {/* Metric 2: Total Orders */}
              <div style={{
                backgroundColor: '#ffffff',
                padding: '1.4rem',
                borderRadius: '14px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase' }}>Orders Processed</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingCart size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#111827', margin: '0.4rem 0 0.2rem' }}>
                  {orders.length} Orders
                </div>
                <div style={{ fontSize: '0.76rem', color: '#b45309', fontWeight: '700' }}>
                  {pendingOrdersCount} pending • {readyOrdersCount} ready for pickup
                </div>
              </div>

              {/* Metric 3: Inventory Units */}
              <div style={{
                backgroundColor: '#ffffff',
                padding: '1.4rem',
                borderRadius: '14px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase' }}>Stock Items</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#111827', margin: '0.4rem 0 0.2rem' }}>
                  {catalogProducts.length} Products
                </div>
                <div style={{ fontSize: '0.76rem', color: lowStockItems.length > 0 ? '#dc2626' : '#16a34a', fontWeight: '700' }}>
                  {lowStockItems.length > 0 ? `${lowStockItems.length} items low stock` : 'All items well stocked'}
                </div>
              </div>

              {/* Metric 4: Customer Satisfaction */}
              <div style={{
                backgroundColor: '#ffffff',
                padding: '1.4rem',
                borderRadius: '14px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase' }}>Order Satisfaction</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#15803d', margin: '0.4rem 0 0.2rem' }}>
                  99.2%
                </div>
                <div style={{ fontSize: '0.76rem', color: '#6b7280' }}>
                  Zero return disputes reported
                </div>
              </div>

            </div>

            {/* Visual Analytics Row: 7-Day Performance & Category Breakdown */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {/* Daily Sales Bar Chart */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                      Daily Revenue Performance
                    </h3>
                    <p style={{ fontSize: '0.76rem', color: '#6b7280', margin: '2px 0 0' }}>Last 7 Days (OMR)</p>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#800020', fontWeight: '700' }}>Average: OMR 82.500 / day</span>
                </div>

                {/* Pure CSS Bar Chart */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  height: '180px',
                  paddingTop: '1rem',
                  gap: '0.75rem',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  {[
                    { day: 'Sat', val: 78, amt: '78.500' },
                    { day: 'Sun', val: 120, amt: '120.000' },
                    { day: 'Mon', val: 95, amt: '95.000' },
                    { day: 'Tue', val: 65, amt: '65.500' },
                    { day: 'Wed', val: 140, amt: '140.000' },
                    { day: 'Thu', val: 165, amt: '165.500' },
                    { day: 'Fri', val: 110, amt: '110.000' }
                  ].map((bar, idx) => (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#800020', marginBottom: '4px' }}>
                        {bar.amt}
                      </span>
                      <div
                        style={{
                          width: '100%',
                          maxWidth: '36px',
                          height: `${(bar.val / 170) * 100}%`,
                          background: idx === 5 ? '#800020' : 'linear-gradient(180deg, #d4af37 0%, #800020 100%)',
                          borderRadius: '6px 6px 0 0',
                          transition: 'height 0.3s ease'
                        }}
                        title={`OMR ${bar.amt}`}
                      />
                      <span style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '6px', fontWeight: '600' }}>
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department Sales Breakdown */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#111827', margin: '0 0 1.25rem' }}>
                  Sales by Category Share
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                  {[
                    { name: 'Apparel & Clothing', pct: 44, color: '#800020' },
                    { name: 'Footwear & Shoes', pct: 22, color: '#b8860b' },
                    { name: 'Books & Stationery', pct: 18, color: '#1e7e34' },
                    { name: 'Bags & Luggage', pct: 10, color: '#0b5ed7' },
                    { name: 'Dining, Wellness & Tech Gear', pct: 6, color: '#d37300' }
                  ].map((cat, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                        <span style={{ color: '#374151' }}>{cat.name}</span>
                        <span style={{ color: cat.color }}>{cat.pct}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${cat.pct}%`, height: '100%', backgroundColor: cat.color, borderRadius: '9999px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders Snapshot */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                  Recent Customer Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  style={{ background: 'none', border: 'none', color: '#800020', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  View All Orders →
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb', color: '#4b5563' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Order Ref</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Customer</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Items Summary</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Payment</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Amount</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 4).map((o) => (
                      <tr key={o.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: '#800020' }}>
                          #{o.orderNumber}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: '700', color: '#111827' }}>{o.customerName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{o.customerPhone}</div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: '#4b5563' }}>
                          {o.itemsSummary}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.76rem',
                            fontWeight: '700',
                            color: o.paymentMethod === 'Debit Card' ? '#15803d' : '#854d0e',
                            backgroundColor: o.paymentMethod === 'Debit Card' ? '#dcfce7' : '#fef9c3',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px'
                          }}>
                            {o.paymentMethod === 'Debit Card' ? <CreditCard size={12} /> : <Banknote size={12} />}
                            {o.paymentMethod}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: '#800020' }}>
                          OMR {o.totalAmount}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.65rem',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            backgroundColor: o.status === 'COMPLETED' ? '#dcfce7' : o.status === 'READY_FOR_PICKUP' ? '#dbeafe' : '#fef3c7',
                            color: o.status === 'COMPLETED' ? '#15803d' : o.status === 'READY_FOR_PICKUP' ? '#1d4ed8' : '#b45309'
                          }}>
                            {o.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                            style={{
                              padding: '0.35rem 0.55rem',
                              borderRadius: '6px',
                              border: '1px solid #d1d5db',
                              fontSize: '0.78rem',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="READY_FOR_PICKUP">READY FOR PICKUP</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: FULL ORDERS MANAGEMENT                                 */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#800020', margin: 0 }}>
                  Orders Fulfillment & Tracking
                </h2>
                <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '3px 0 0' }}>
                  Manage payment statuses, delivery confirmations, and dispatch notes.
                </p>
              </div>

              {/* Order Search Input */}
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="text"
                  placeholder="Search order ref, customer, phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.82rem'
                  }}
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: `All Orders (${orders.length})` },
                { id: 'PENDING', label: `Pending (${orders.filter(o => o.status === 'PENDING').length})` },
                { id: 'PROCESSING', label: `Processing (${orders.filter(o => o.status === 'PROCESSING').length})` },
                { id: 'READY_FOR_PICKUP', label: `Ready for Pickup (${orders.filter(o => o.status === 'READY_FOR_PICKUP').length})` },
                { id: 'COMPLETED', label: `Completed (${orders.filter(o => o.status === 'COMPLETED').length})` }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setOrderFilter(f.id)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    border: orderFilter === f.id ? '1px solid #800020' : '1px solid #e5e7eb',
                    backgroundColor: orderFilter === f.id ? '#800020' : '#ffffff',
                    color: orderFilter === f.id ? '#ffffff' : '#4b5563',
                    cursor: 'pointer'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Full Orders Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb', color: '#4b5563' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Order Ref</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Customer</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Fulfillment</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Payment Method</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Total</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: '#800020' }}>
                        #{o.orderNumber}
                        <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: '500' }}>{o.createdAt}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: '700', color: '#111827' }}>{o.customerName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{o.customerPhone}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#374151' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}>
                          <Truck size={14} color="#800020" />
                          {o.fulfillment}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.76rem',
                          fontWeight: '700',
                          color: o.paymentMethod === 'Debit Card' ? '#15803d' : '#854d0e',
                          backgroundColor: o.paymentMethod === 'Debit Card' ? '#dcfce7' : '#fef9c3',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px'
                        }}>
                          {o.paymentMethod === 'Debit Card' ? <CreditCard size={13} /> : <Banknote size={13} />}
                          {o.paymentMethod}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '900', color: '#800020' }}>
                        OMR {o.totalAmount}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          backgroundColor: o.status === 'COMPLETED' ? '#dcfce7' : o.status === 'READY_FOR_PICKUP' ? '#dbeafe' : '#fef3c7',
                          color: o.status === 'COMPLETED' ? '#15803d' : o.status === 'READY_FOR_PICKUP' ? '#1d4ed8' : '#b45309'
                        }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                          style={{
                            padding: '0.4rem 0.65rem',
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            fontSize: '0.78rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="READY_FOR_PICKUP">READY FOR PICKUP</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: PRODUCTS, PRICE, SIZE & CATALOG MANAGER                 */}
        {/* ============================================================== */}
        {activeTab === 'inventory' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #ebdada',
            padding: '1.5rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            {/* Top Toolbar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem',
              borderBottom: '1.5px solid #f3e8eb',
              paddingBottom: '1.25rem'
            }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#9E2A2B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Package size={22} color="#9E2A2B" />
                  <span>Products & Catalog Management</span>
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0' }}>
                  Full control: edit prices, update size matrices, adjust stock, delete items, and add new products to the shop.
                </p>
              </div>

              {/* Action Buttons: Add Product & Reset Defaults */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.6rem 1.15rem',
                    backgroundColor: '#9E2A2B',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 3px 10px rgba(158, 42, 43, 0.25)'
                  }}
                >
                  <Plus size={16} />
                  <span>+ Add Product to Shop</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetCatalog}
                  title="Reset all products and prices back to default catalog"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.6rem 0.95rem',
                    backgroundColor: '#f8fafc',
                    color: '#64748b',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={14} />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.25rem'
            }}>
              {/* Search Bar */}
              <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="text"
                  placeholder="Search product name, SKU, or category..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.85rem 0.55rem 2.4rem',
                    border: '1.5px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Status summary */}
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Showing <strong>{filteredCatalog.length}</strong> of <strong>{catalogProducts.length}</strong> products
              </div>
            </div>

            {/* Category Filter Chips */}
            <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: `All Products (${catalogProducts.length})` },
                { id: 'LOW', label: `⚠️ Low Stock (${lowStockItems.length})` },
                ...OFFICIAL_CATEGORIES.map(c => ({
                  id: c.id,
                  label: `${c.icon} ${c.nameEn}`
                }))
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setInventoryFilter(f.id)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.76rem',
                    fontWeight: inventoryFilter === f.id ? '800' : '600',
                    border: inventoryFilter === f.id ? '1.5px solid #9E2A2B' : '1px solid #e5e7eb',
                    backgroundColor: inventoryFilter === f.id ? '#9E2A2B' : '#ffffff',
                    color: inventoryFilter === f.id ? '#ffffff' : '#4b5563',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Products Table with Direct Price & Size Controls */}
            <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#faf9f6', borderBottom: '2px solid #ebdada', color: '#475569' }}>
                    <th style={{ padding: '0.75rem 0.85rem', width: '50px' }}>Photo</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Product Details</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Category / Collection</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Base Price</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Size Variants</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Stock</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCatalog.map((item) => {
                    const isLow = (item.stock || 0) <= (item.threshold || 5);
                    return (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: isLow ? '#fffbfb' : '#ffffff',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        {/* Thumbnail */}
                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <img
                            src={item.image || '/products/polo-shirt-front.jpg'}
                            alt=""
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '1px solid #ebdada',
                              backgroundColor: '#f8fafc'
                            }}
                            onError={(e) => { e.target.src = '/products/polo-shirt-front.jpg'; }}
                          />
                        </td>

                        {/* Product Details */}
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ fontWeight: '800', color: '#111827', fontSize: '0.9rem' }}>
                            {item.nameEn}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', direction: 'rtl', textAlign: 'left' }}>
                            {item.nameAr}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace', marginTop: '2px' }}>
                            SKU: {item.sku}
                          </div>
                        </td>

                        {/* Category Tag */}
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{
                            display: 'inline-block',
                            fontSize: '0.74rem',
                            fontWeight: '700',
                            backgroundColor: '#fdf2f4',
                            color: '#9E2A2B',
                            padding: '0.22rem 0.6rem',
                            borderRadius: '6px',
                            border: '1px solid #f0d5db',
                            whiteSpace: 'nowrap'
                          }}>
                            {item.collectionEn || item.category}
                          </span>
                        </td>

                        {/* Price (OMR) */}
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ fontWeight: '900', color: '#9E2A2B', fontSize: '0.98rem' }}>
                            OMR {typeof item.price === 'number' ? item.price.toFixed(3) : parseFloat(item.price || 0).toFixed(3)}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            style={{
                              border: 'none',
                              background: 'none',
                              color: '#9E2A2B',
                              fontSize: '0.72rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              padding: 0,
                              textDecoration: 'underline'
                            }}
                          >
                            Edit Price
                          </button>
                        </td>

                        {/* Size Variants */}
                        <td style={{ padding: '0.75rem 1rem', maxWidth: '240px' }}>
                          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                            {Array.isArray(item.sizes) && item.sizes.length > 0 ? (
                              item.sizes.map((sz, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    fontSize: '0.7rem',
                                    fontWeight: '700',
                                    backgroundColor: '#f1f5f9',
                                    color: '#334155',
                                    padding: '0.15rem 0.45rem',
                                    borderRadius: '4px',
                                    border: '1px solid #e2e8f0'
                                  }}
                                >
                                  {sz}
                                </span>
                              ))
                            ) : (
                              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Standard</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            style={{
                              border: 'none',
                              background: 'none',
                              color: '#9E2A2B',
                              fontSize: '0.72rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              padding: 0,
                              marginTop: '3px',
                              textDecoration: 'underline'
                            }}
                          >
                            Edit Sizes
                          </button>
                        </td>

                        {/* Current Stock */}
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ fontWeight: '800', fontSize: '0.92rem', color: isLow ? '#dc2626' : '#111827' }}>
                            {item.stock} units
                          </div>
                          {isLow ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.68rem',
                              fontWeight: '800',
                              color: '#dc2626',
                              backgroundColor: '#fee2e2',
                              padding: '0.15rem 0.45rem',
                              borderRadius: '4px'
                            }}>
                              <AlertTriangle size={11} />
                              LOW STOCK
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: '700' }}>
                              In Stock
                            </span>
                          )}
                        </td>

                        {/* Actions (Edit / Delete) */}
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              title="Edit product price, sizes, category & details"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                padding: '0.4rem 0.75rem',
                                backgroundColor: '#fdf2f4',
                                color: '#9E2A2B',
                                border: '1px solid #f0d5db',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.78rem',
                                fontWeight: '700'
                              }}
                            >
                              <Edit2 size={13} />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              title="Delete product from shop"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                padding: '0.4rem 0.65rem',
                                backgroundColor: '#fff1f2',
                                color: '#e11d48',
                                border: '1px solid #fecdd3',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.78rem',
                                fontWeight: '700'
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredCatalog.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
                  <Package size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
                  <p style={{ fontWeight: '800', fontSize: '1rem', margin: 0 }}>No products matched your criteria</p>
                  <p style={{ fontSize: '0.82rem', margin: '4px 0 1rem' }}>Try clearing the search or category filter</p>
                  <button
                    onClick={() => { setInventorySearch(''); setInventoryFilter('ALL'); }}
                    style={{
                      padding: '0.45rem 1rem',
                      backgroundColor: '#9E2A2B',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: CATEGORY ACCESS & CONTROLS                              */}
        {/* ============================================================== */}
        {activeTab === 'categories' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #ebdada',
            padding: '1.5rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            <div style={{ marginBottom: '1.5rem', borderBottom: '1.5px solid #f3e8eb', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#9E2A2B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Grid size={22} color="#9E2A2B" />
                <span>All 11 Curated Collections & Categories</span>
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0' }}>
                Manage category permissions, monitor items per department, and inspect stock distributions.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}>
              {OFFICIAL_CATEGORIES.map((cat) => {
                const catProducts = catalogProducts.filter(p => p.category === cat.id || p.subCategory === cat.id);
                const totalStock = catProducts.reduce((sum, p) => sum + (p.stock || 0), 0);

                return (
                  <div
                    key={cat.id}
                    style={{
                      backgroundColor: '#faf9f6',
                      border: '1.5px solid #ebdada',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                        <span style={{ fontSize: '1.8rem' }}>{cat.icon}</span>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          backgroundColor: '#fdf2f4',
                          color: '#9E2A2B',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '9999px',
                          border: '1px solid #f0d5db'
                        }}>
                          {cat.tagEn}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#111827', margin: '0 0 2px' }}>
                        {cat.nameEn}
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: '#64748b', direction: 'rtl', textAlign: 'left', margin: '0 0 0.85rem' }}>
                        {cat.nameAr}
                      </p>
                    </div>

                    <div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.55rem 0.75rem',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.8rem',
                        marginBottom: '0.85rem'
                      }}>
                        <span style={{ color: '#64748b' }}>Active Products:</span>
                        <strong style={{ color: '#111827' }}>{catProducts.length} items</strong>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.55rem 0.75rem',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.8rem',
                        marginBottom: '0.85rem'
                      }}>
                        <span style={{ color: '#64748b' }}>Total Stock:</span>
                        <strong style={{ color: totalStock <= 15 ? '#dc2626' : '#16a34a' }}>{totalStock} units</strong>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setInventoryFilter(cat.id);
                          setActiveTab('inventory');
                        }}
                        style={{
                          width: '100%',
                          padding: '0.55rem',
                          backgroundColor: '#9E2A2B',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        Manage Products in this Category →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: ACTIVE CUSTOMER CARTS (ADMIN EXCLUSIVE OVERSIGHT)         */}
        {/* ============================================================== */}
        {activeTab === 'customer_carts' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#800020', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShoppingBag size={22} color="#800020" />
                  <span>{isRTL ? 'سلات تسوق العملاء النشطة (كل العملاء)' : 'Active Customer Carts (All Users)'}</span>
                </h2>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.84rem', color: '#6b7280' }}>
                  {isRTL
                    ? 'هذه الميزة حصرية للمسؤول فقط لمتابعة ما يضيفه كل عميل في سلته لحظياً.'
                    : 'Exclusive Administrator View: Track every customer\'s real-time cart contents and item choices.'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  color: '#15803d',
                  backgroundColor: '#dcfce7',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px'
                }}>
                  ● {customerCarts.length} {isRTL ? 'سلات عملاء نشطة' : 'Active Customer Carts'}
                </span>
                <button
                  onClick={() => {
                    if (getAllCustomerCarts) {
                      setCustomerCarts(getAllCustomerCarts());
                    }
                  }}
                  title="Refresh Carts"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    color: '#374151'
                  }}
                >
                  <RefreshCw size={13} />
                  <span>{isRTL ? 'تحديث' : 'Refresh'}</span>
                </button>
              </div>
            </div>

            {customerCarts.length === 0 ? (
              <div style={{ padding: '3.5rem 1rem', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
                <ShoppingBag size={48} color="#9ca3af" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#374151', margin: 0 }}>
                  {isRTL ? 'لا توجد سلات نشطة حالياً' : 'No Active Customer Carts'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.35rem 0 0' }}>
                  {isRTL ? 'عندما يضيف أي شخص منتجاً إلى سلته ستظهر هنا للمسؤول فقط.' : 'When any person adds products to their cart, their cart contents will appear here for the admin.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {customerCarts.map((cart, idx) => (
                  <div key={cart.userId || idx} style={{
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    backgroundColor: '#fafafa'
                  }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem', marginBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#fdf2f4', color: '#9E2A2B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                          {cart.customerName ? cart.customerName[0].toUpperCase() : 'C'}
                        </div>
                        <div>
                          <div style={{ fontWeight: '800', color: '#111827', fontSize: '0.95rem' }}>
                            {cart.customerName}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                            {cart.customerEmail} {cart.customerPhone ? `• ${cart.customerPhone}` : ''} • Updated {cart.updatedAt || 'Recently'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ textAlign: isRTL ? 'left' : 'right' }}>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>{isRTL ? 'إجمالي السلة' : 'Cart Subtotal'}</span>
                          <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#800020' }}>OMR {cart.subtotal}</span>
                        </div>
                        <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '0.76rem', fontWeight: '800', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                          {cart.itemCount} {isRTL ? 'منتج' : 'Items'}
                        </span>
                      </div>
                    </div>

                    {/* Items table */}
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ color: '#6b7280', borderBottom: '1px solid #f0f0f0' }}>
                            <th style={{ padding: '0.5rem' }}>{isRTL ? 'المنتج' : 'Product'}</th>
                            <th style={{ padding: '0.5rem' }}>{isRTL ? 'المقاس' : 'Size'}</th>
                            <th style={{ padding: '0.5rem' }}>{isRTL ? 'الكمية' : 'Qty'}</th>
                            <th style={{ padding: '0.5rem' }}>{isRTL ? 'سعر الوحدة' : 'Unit Price'}</th>
                            <th style={{ padding: '0.5rem' }}>{isRTL ? 'الإجمالي' : 'Subtotal'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(cart.items || []).map((it, iIdx) => (
                            <tr key={it.id || iIdx} style={{ borderBottom: '1px solid #f5f5f5' }}>
                              <td style={{ padding: '0.5rem', fontWeight: '700', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <img src={it.image} alt={it.nameEn} style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/products/polo-shirt-front.jpg'; }} />
                                <span>{isRTL && it.nameAr ? it.nameAr : it.nameEn}</span>
                              </td>
                              <td style={{ padding: '0.5rem', color: '#4b5563' }}>
                                <span style={{ backgroundColor: '#f3f4f6', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: '600' }}>
                                  {it.size}
                                </span>
                              </td>
                              <td style={{ padding: '0.5rem', fontWeight: '800', color: '#111827' }}>
                                × {it.quantity}
                              </td>
                              <td style={{ padding: '0.5rem', color: '#4b5563' }}>
                                OMR {parseFloat(it.price).toFixed(3)}
                              </td>
                              <td style={{ padding: '0.5rem', fontWeight: '800', color: '#15803d' }}>
                                OMR {(parseFloat(it.price) * it.quantity).toFixed(3)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: CUSTOMER DIRECTORY & ACCOUNTS                          */}
        {/* ============================================================== */}
        {activeTab === 'customers' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            {/* Header with Title, Search, and + Add Customer Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#800020', margin: 0 }}>
                  Customer Accounts Directory
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '4px 0 0' }}>
                  Live synchronized directory of registered customers with active status.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {/* Search Customer */}
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input
                    type="text"
                    placeholder="Search customer name, email..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    style={{
                      padding: '0.5rem 0.85rem 0.5rem 2rem',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.84rem',
                      width: '240px'
                    }}
                  />
                </div>

                {/* + Add New Customer Button */}
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    backgroundColor: '#800020',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.55rem 1rem',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(128, 0, 32, 0.2)'
                  }}
                >
                  <Plus size={16} />
                  <span>+ Create New Customer</span>
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb', color: '#4b5563' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Customer Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Email Address</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Phone</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                        No customers found matching "{customerSearch}".
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) => (
                      <tr key={cust.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#111827' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: '#f3e8ff',
                              color: '#7e22ce',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '800',
                              fontSize: '0.82rem',
                              flexShrink: 0
                            }}>
                              {(cust.name || 'C').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div>{cust.name}</div>
                              {cust.joinedDate && (
                                <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Joined: {cust.joinedDate}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: '#4b5563' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.84rem' }}>{cust.email}</span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: '#4b5563' }}>
                          {cust.phone}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{
                            fontSize: '0.76rem',
                            fontWeight: '800',
                            backgroundColor: cust.status === 'Blocked' ? '#fee2e2' : '#dcfce7',
                            color: cust.status === 'Blocked' ? '#dc2626' : '#15803d',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '9999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}>
                            <span style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: cust.status === 'Blocked' ? '#dc2626' : '#16a34a'
                            }}></span>
                            {cust.status === 'Blocked' ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleCustomerStatus(cust)}
                              title={cust.status === 'Blocked' ? 'Activate customer' : 'Deactivate customer'}
                              style={{
                                padding: '0.3rem 0.6rem',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                borderRadius: '6px',
                                border: '1px solid #d1d5db',
                                backgroundColor: '#ffffff',
                                color: cust.status === 'Blocked' ? '#15803d' : '#b45309',
                                cursor: 'pointer'
                              }}
                            >
                              {cust.status === 'Blocked' ? 'Activate' : 'Toggle Status'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomer(cust)}
                              title="Delete customer"
                              style={{
                                padding: '0.3rem 0.5rem',
                                fontSize: '0.75rem',
                                borderRadius: '6px',
                                border: '1px solid #fee2e2',
                                backgroundColor: '#fff5f5',
                                color: '#dc2626',
                                cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal: Create New Customer */}
            {showAddCustomerModal && (
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
                zIndex: 99999,
                padding: '1rem'
              }}>
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  maxWidth: '480px',
                  width: '100%',
                  padding: '1.75rem',
                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#800020', margin: 0 }}>
                      + Create New Customer Account
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddCustomerModal(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleCreateCustomerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>
                        Customer Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hussain"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. itshussain302@gmail.com"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +968 9123 4567"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>
                        Account Status
                      </label>
                      <select
                        value={newCustomer.status}
                        onChange={(e) => setNewCustomer({ ...newCustomer, status: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.88rem', backgroundColor: '#fff' }}
                      >
                        <option value="Active">Active</option>
                        <option value="Blocked">Blocked</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setShowAddCustomerModal(false)}
                        style={{
                          padding: '0.6rem 1.15rem',
                          borderRadius: '8px',
                          border: '1px solid #d1d5db',
                          backgroundColor: '#ffffff',
                          fontWeight: '700',
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          padding: '0.6rem 1.25rem',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: '#800020',
                          color: '#ffffff',
                          fontWeight: '800',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(128, 0, 32, 0.25)'
                        }}
                      >
                        Save & Create Customer
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TOAST NOTIFICATION BANNER                                      */}
        {/* ============================================================== */}
        {feedback && (
          <div style={{
            position: 'fixed',
            top: '24px',
            right: isRTL ? 'auto' : '24px',
            left: isRTL ? '24px' : 'auto',
            zIndex: 99999,
            backgroundColor: feedback.type === 'error' ? '#991b1b' : '#166534',
            color: '#ffffff',
            padding: '0.85rem 1.35rem',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.9rem',
            fontWeight: '700',
            animation: 'fadeIn 0.2s ease'
          }}>
            <CheckCircle size={18} />
            <span>{feedback.text}</span>
            <button
              onClick={() => setFeedback(null)}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 0, marginLeft: '0.5rem' }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* EDIT PRODUCT MODAL (PRICE, SIZES, CATEGORY, STOCK)             */}
        {/* ============================================================== */}
        {editingProduct && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            zIndex: 9999,
            backdropFilter: 'blur(3px)'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #ebdada',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
              {/* Modal Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                borderBottom: '1.5px solid #f1f5f9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Edit2 size={18} color="#9E2A2B" />
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '900', color: '#111827' }}>
                    Edit Product: {editingProduct.nameEn}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.2rem' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveEdit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                
                {/* Row 1: Price (OMR) & Category */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#9E2A2B', marginBottom: '0.35rem' }}>
                      Price (OMR) *
                    </label>
                    <input
                      type="number"
                      step="0.050"
                      min="0.100"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '1.5px solid #9E2A2B',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        fontWeight: '800',
                        color: '#9E2A2B',
                        outline: 'none',
                        backgroundColor: '#fffcfc'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#334155', marginBottom: '0.35rem' }}>
                      Category / Collection *
                    </label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.86rem',
                        fontWeight: '600',
                        outline: 'none'
                      }}
                    >
                      {OFFICIAL_CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.tagEn}: {c.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Available Sizes */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#9E2A2B', marginBottom: '0.2rem' }}>
                    Available Size Options (Comma-separated) *
                  </label>
                  <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '0 0 0.35rem' }}>
                    Examples: <code>XS, S, M, L, XL, XXL</code> or <code>28, 30, 32, 34, 36</code> or <code>Standard (750ml), Large (1000ml)</code>
                  </p>
                  <input
                    type="text"
                    required
                    value={editingProduct.sizes}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sizes: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1.5px solid #9E2A2B',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: '700',
                      outline: 'none',
                      backgroundColor: '#fffcfc'
                    }}
                  />
                </div>

                {/* Row 3: Product Names (En & Ar) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                      Product Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.nameEn}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                      اسم المنتج (العربية)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={editingProduct.nameAr}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nameAr: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Row 4: Stock & Threshold */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                      Current Stock *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        fontWeight: '700',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                      Low Stock Alert
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editingProduct.threshold}
                      onChange={(e) => setEditingProduct({ ...editingProduct, threshold: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                      SKU Code
                    </label>
                    <input
                      type="text"
                      value={editingProduct.sku}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontFamily: 'monospace',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Row 5: Image URL & Presets */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                    Product Photo URL
                  </label>
                  <input
                    type="text"
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  />
                  {/* Image presets */}
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Quick Photos:</span>
                    {[
                      { label: 'Polo Shirt', url: '/products/polo-shirt-front.jpg' },
                      { label: 'Trousers', url: '/products/boys-gray-trousers.jpg' },
                      { label: 'Pleated Skirt', url: '/products/girls-gray-skirt.jpg' },
                      { label: 'Shoes', url: '/products/boys-black-shoes.jpg' },
                      { label: 'Backpack', url: '/products/school-bags-accessories.jpg' },
                      { label: 'Book', url: '/products/cambridge-english-book.jpg' },
                      { label: 'Lunch Box', url: '/products/lunch-boxes-drinkware.jpg' },
                      { label: 'Tech', url: '/products/electronics-mobile-accessories.jpg' },
                      { label: 'Sports', url: '/products/fitness-sports-equipment.jpg' }
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditingProduct({ ...editingProduct, image: p.url })}
                        style={{
                          fontSize: '0.68rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          border: editingProduct.image === p.url ? '1px solid #9E2A2B' : '1px solid #cbd5e1',
                          backgroundColor: editingProduct.image === p.url ? '#fdf2f4' : '#ffffff',
                          color: editingProduct.image === p.url ? '#9E2A2B' : '#475569',
                          cursor: 'pointer'
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 6: Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                    Product Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={editingProduct.descEn}
                    onChange={(e) => setEditingProduct({ ...editingProduct, descEn: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Modal Footer Buttons */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '1rem',
                  marginTop: '0.5rem'
                }}>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    style={{
                      padding: '0.65rem 1.25rem',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.65rem 1.5rem',
                      backgroundColor: '#9E2A2B',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '800',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(158, 42, 43, 0.25)'
                    }}
                  >
                    <Save size={16} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ADD NEW PRODUCT MODAL (ADD EXTRA THINGS IN SHOP)                */}
        {/* ============================================================== */}
        {isAddModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            zIndex: 9999,
            backdropFilter: 'blur(3px)'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #ebdada',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
              {/* Modal Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                borderBottom: '1.5px solid #f1f5f9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={20} color="#9E2A2B" />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900', color: '#111827' }}>
                    Add Extra Item to Shop
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.2rem' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleCreateProduct} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                
                {/* Row 1: Name En & Ar */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#111827', marginBottom: '0.35rem' }}>
                      Product Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cambridge Science Lab Coat"
                      value={newProductForm.nameEn}
                      onChange={(e) => setNewProductForm({ ...newProductForm, nameEn: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.86rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#111827', marginBottom: '0.35rem' }}>
                      اسم المنتج (العربية)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      placeholder="مثال: معطف مختبر العلوم المعتمد"
                      value={newProductForm.nameAr}
                      onChange={(e) => setNewProductForm({ ...newProductForm, nameAr: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.86rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Row 2: Category & Price */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#334155', marginBottom: '0.35rem' }}>
                      Category / Department *
                    </label>
                    <select
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.86rem',
                        fontWeight: '600',
                        outline: 'none'
                      }}
                    >
                      {OFFICIAL_CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.tagEn}: {c.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#9E2A2B', marginBottom: '0.35rem' }}>
                      Price (OMR) *
                    </label>
                    <input
                      type="number"
                      step="0.050"
                      min="0.100"
                      required
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '1.5px solid #9E2A2B',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        fontWeight: '800',
                        color: '#9E2A2B',
                        outline: 'none',
                        backgroundColor: '#fffcfc'
                      }}
                    />
                  </div>
                </div>

                {/* Row 3: Available Sizes */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#9E2A2B', marginBottom: '0.2rem' }}>
                    Available Sizes (Comma-separated) *
                  </label>
                  <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '0 0 0.35rem' }}>
                    Example sizes: <code>XS, S, M, L, XL</code> or <code>30, 32, 34, 36</code> or <code>Standard</code>
                  </p>
                  <input
                    type="text"
                    required
                    value={newProductForm.sizes}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sizes: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1.5px solid #9E2A2B',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: '700',
                      outline: 'none',
                      backgroundColor: '#fffcfc'
                    }}
                  />
                </div>

                {/* Row 4: Stock & SKU */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                      Initial Stock Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newProductForm.stock}
                      onChange={(e) => setNewProductForm({ ...newProductForm, stock: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        fontWeight: '700',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                      SKU Code (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SHOP-ITEM-01"
                      value={newProductForm.sku}
                      onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontFamily: 'monospace',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Row 5: Photo URL */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                    Product Photo URL
                  </label>
                  <input
                    type="text"
                    value={newProductForm.image}
                    onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  />
                  {/* Preset Buttons */}
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Select Template Image:</span>
                    {[
                      { label: 'Polo Shirt', url: '/products/polo-shirt-front.jpg' },
                      { label: 'Trousers', url: '/products/boys-gray-trousers.jpg' },
                      { label: 'Pleated Skirt', url: '/products/girls-gray-skirt.jpg' },
                      { label: 'Shoes', url: '/products/boys-black-shoes.jpg' },
                      { label: 'Backpack', url: '/products/school-bags-accessories.jpg' },
                      { label: 'Curriculum Book', url: '/products/cambridge-english-book.jpg' },
                      { label: 'Lunch Box', url: '/products/lunch-boxes-drinkware.jpg' },
                      { label: 'Tech / Gadget', url: '/products/electronics-mobile-accessories.jpg' },
                      { label: 'Sports', url: '/products/fitness-sports-equipment.jpg' },
                      { label: 'Luggage', url: '/products/travel-outdoor-accessories.jpg' }
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewProductForm({ ...newProductForm, image: p.url })}
                        style={{
                          fontSize: '0.68rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          border: newProductForm.image === p.url ? '1px solid #9E2A2B' : '1px solid #cbd5e1',
                          backgroundColor: newProductForm.image === p.url ? '#fdf2f4' : '#ffffff',
                          color: newProductForm.image === p.url ? '#9E2A2B' : '#475569',
                          cursor: 'pointer'
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 6: Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                    Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the product, materials, and features..."
                    value={newProductForm.descEn}
                    onChange={(e) => setNewProductForm({ ...newProductForm, descEn: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Modal Footer Buttons */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '1rem',
                  marginTop: '0.5rem'
                }}>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    style={{
                      padding: '0.65rem 1.25rem',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.65rem 1.5rem',
                      backgroundColor: '#9E2A2B',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '800',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(158, 42, 43, 0.25)'
                    }}
                  >
                    <Plus size={16} />
                    <span>Publish Item to Shop</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
