import React, { useState, useMemo } from 'react';
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
  Store
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';

export default function AdminDashboardPage() {
  const { user, isAdmin, logout } = useAuth();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [orderSearch, setOrderSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('7d');

  // Realistic sample orders
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: 'ORD-2026-92810',
      customerName: 'Salim Al-Shanfari',
      customerPhone: '+968 9123 4567',
      customerEmail: 'salim.shanfari@gmail.com',
      itemsCount: 3,
      itemsSummary: 'Polo Shirt (M), Boys Trousers (30), Belt',
      totalAmount: '16.500',
      paymentMethod: 'Debit Card',
      paymentStatus: 'PAID',
      status: 'PENDING',
      fulfillment: 'Store Pickup',
      createdAt: 'Today, 11:40 AM'
    },
    {
      id: 2,
      orderNumber: 'ORD-2026-84192',
      customerName: 'Fatima Al-Kathiri',
      customerPhone: '+968 9234 5678',
      customerEmail: 'fatima.kathiri@hotmail.com',
      itemsCount: 2,
      itemsSummary: 'Girls Skirt (28), White Socks (M)',
      totalAmount: '9.000',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'PENDING_CASH',
      status: 'PROCESSING',
      fulfillment: 'Home Delivery',
      createdAt: 'Today, 09:15 AM'
    },
    {
      id: 3,
      orderNumber: 'ORD-2026-71049',
      customerName: 'Mohammed Al-Rawas',
      customerPhone: '+968 9345 6789',
      customerEmail: 'm.rawas@omantel.net.om',
      itemsCount: 4,
      itemsSummary: 'School Backpack, Scientific Calculator, Geometry Set',
      totalAmount: '25.500',
      paymentMethod: 'Debit Card',
      paymentStatus: 'PAID',
      status: 'READY_FOR_PICKUP',
      fulfillment: 'Store Pickup',
      createdAt: 'Yesterday, 04:20 PM'
    },
    {
      id: 4,
      orderNumber: 'ORD-2026-65412',
      customerName: 'Aisha Al-Balushi',
      customerPhone: '+968 9456 7890',
      customerEmail: 'aisha.balushi@outlook.com',
      itemsCount: 2,
      itemsSummary: 'Insulated Lunch Box Set, Water Bottle',
      totalAmount: '5.500',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'PENDING_CASH',
      status: 'COMPLETED',
      fulfillment: 'Home Delivery',
      createdAt: 'Yesterday, 01:10 PM'
    },
    {
      id: 5,
      orderNumber: 'ORD-2026-54321',
      customerName: 'Khalid Al-Marhoon',
      customerPhone: '+968 9567 8901',
      customerEmail: 'khalid.marhoon@yahoo.com',
      itemsCount: 3,
      itemsSummary: 'Athletics Training Shoes (38), Gym Bag, Socks',
      totalAmount: '12.500',
      paymentMethod: 'Debit Card',
      paymentStatus: 'PAID',
      status: 'COMPLETED',
      fulfillment: 'Store Pickup',
      createdAt: '11 Nov 2026'
    },
    {
      id: 6,
      orderNumber: 'ORD-2026-43219',
      customerName: 'Noura Al-Amri',
      customerPhone: '+968 9678 9012',
      customerEmail: 'noura.amri@gmail.com',
      itemsCount: 1,
      itemsSummary: 'Multi-Pocket Travel Duffel (35L)',
      totalAmount: '13.000',
      paymentMethod: 'Debit Card',
      paymentStatus: 'PAID',
      status: 'COMPLETED',
      fulfillment: 'Home Delivery',
      createdAt: '10 Nov 2026'
    }
  ]);

  // Inventory tracking across categories
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Polo Shirt (Maroon)', category: 'Uniforms', size: 'XS', stock: 45, threshold: 10, sku: 'UNIF-POLO-XS', price: 6.000 },
    { id: 2, name: 'Polo Shirt (Maroon)', category: 'Uniforms', size: 'S',  stock: 60, threshold: 10, sku: 'UNIF-POLO-S',  price: 6.000 },
    { id: 3, name: 'Polo Shirt (Maroon)', category: 'Uniforms', size: 'M',  stock: 85, threshold: 10, sku: 'UNIF-POLO-M',  price: 6.000 },
    { id: 4, name: 'Polo Shirt (Maroon)', category: 'Uniforms', size: 'L',  stock: 70, threshold: 10, sku: 'UNIF-POLO-L',  price: 6.000 },
    { id: 5, name: "Boys' Gray Trousers", category: 'Trousers', size: '28', stock: 40, threshold: 8, sku: 'UNIF-TRSR-28', price: 8.500 },
    { id: 6, name: "Boys' Gray Trousers", category: 'Trousers', size: '30', stock: 55, threshold: 8, sku: 'UNIF-TRSR-30', price: 8.500 },
    { id: 7, name: "Girls' Pleated Skirt", category: 'Skirts', size: '28',  stock: 45, threshold: 8, sku: 'UNIF-SKRT-28', price: 8.000 },
    { id: 8, name: "Girls' Pleated Skirt", category: 'Skirts', size: '30',  stock: 60, threshold: 8, sku: 'UNIF-SKRT-30', price: 8.000 },
    { id: 9, name: "Boys' Black Shoes", category: 'Shoes', size: '36',   stock: 35, threshold: 8, sku: 'SHOE-BOY-36', price: 12.500 },
    { id: 10, name: "Girls' Mary Jane Shoes", category: 'Shoes', size: '34', stock: 3, threshold: 6, sku: 'SHOE-GRL-34', price: 12.500 }, // Low
    { id: 11, name: 'School Belt (Black)', category: 'Accessories', size: 'Standard', stock: 120, threshold: 15, sku: 'ACCS-BELT-STD', price: 2.500 },
    { id: 12, name: 'School Socks (White)', category: 'Accessories', size: 'M (34-38)', stock: 200, threshold: 25, sku: 'ACCS-SOCK-M', price: 1.000 },
    { id: 13, name: 'Cambridge Primary English', category: 'Books', size: 'Stage 3', stock: 68, threshold: 12, sku: 'BOOK-ENG-P3', price: 7.500 },
    { id: 14, name: 'Cambridge Primary Math', category: 'Books', size: 'Stage 3', stock: 74, threshold: 12, sku: 'BOOK-MTH-P3', price: 7.500 },
    { id: 15, name: 'Spiral Notebooks (5-Pack)', category: 'Stationery', size: 'Single Line', stock: 150, threshold: 20, sku: 'STAT-NOTE-5PK', price: 3.200 },
    { id: 16, name: 'Complete Geometry Set', category: 'Stationery', size: '10-Piece Box', stock: 95, threshold: 15, sku: 'STAT-GEOM-10P', price: 2.500 },
    { id: 17, name: 'School Backpack (Maroon)', category: 'Bags', size: 'Senior', stock: 4, threshold: 8, sku: 'BAG-MRN-SR', price: 14.500 }, // Low
    { id: 18, name: 'Insulated Lunch Box Set', category: 'Lunchware', size: 'Standard (750ml)', stock: 42, threshold: 10, sku: 'LUNCH-BOX-SET', price: 5.500 },
    { id: 19, name: 'Scientific Calculator & Stylus', category: 'Electronics', size: 'Standard', stock: 5, threshold: 8, sku: 'ELEC-CALC-SET', price: 8.500 }, // Low
    { id: 20, name: 'Athletics Training Shoes', category: 'Sports', size: '36', stock: 28, threshold: 6, sku: 'SPRT-TRAIN-36', price: 11.500 },
    { id: 21, name: 'Multi-Pocket Travel Duffel', category: 'Travel', size: 'Medium (35L)', stock: 22, threshold: 5, sku: 'TRVL-BAG-35L', price: 13.000 }
  ]);

  // Sample customers
  const sampleCustomers = [
    { id: 1, name: 'Salim Al-Shanfari', email: 'salim.shanfari@gmail.com', phone: '+968 9123 4567', ordersCount: 4, totalSpend: '58.500', status: 'Active' },
    { id: 2, name: 'Fatima Al-Kathiri', email: 'fatima.kathiri@hotmail.com', phone: '+968 9234 5678', ordersCount: 3, totalSpend: '42.000', status: 'Active' },
    { id: 3, name: 'Mohammed Al-Rawas', email: 'm.rawas@omantel.net.om', phone: '+968 9345 6789', ordersCount: 5, totalSpend: '89.500', status: 'VIP' },
    { id: 4, name: 'Aisha Al-Balushi', email: 'aisha.balushi@outlook.com', phone: '+968 9456 7890', ordersCount: 2, totalSpend: '24.000', status: 'Active' },
    { id: 5, name: 'Khalid Al-Marhoon', email: 'khalid.marhoon@yahoo.com', phone: '+968 9567 8901', ordersCount: 3, totalSpend: '41.500', status: 'Active' }
  ];

  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState('');
  const [exportNotice, setExportNotice] = useState(false);

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleSaveStock = (id) => {
    const val = parseInt(editStock, 10);
    if (!isNaN(val) && val >= 0) {
      setInventory(prev => prev.map(i => i.id === id ? { ...i, stock: val } : i));
    }
    setEditingId(null);
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
  const lowStockItems = inventory.filter(i => i.stock <= i.threshold);

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

  // Filtered inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      if (inventoryFilter === 'LOW' && item.stock > item.threshold) return false;
      if (inventoryFilter !== 'ALL' && inventoryFilter !== 'LOW' && item.category !== inventoryFilter) return false;
      if (inventorySearch.trim()) {
        const q = inventorySearch.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [inventory, inventoryFilter, inventorySearch]);

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
            { id: 'inventory', label: `Inventory & Stock (${lowStockItems.length} Low)`, icon: Package },
            { id: 'customers', label: `Customer Accounts (${sampleCustomers.length})`, icon: Users }
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
                  {inventory.length} SKUs
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
                    { name: 'School Uniforms & Clothing', pct: 44, color: '#800020' },
                    { name: 'School Shoes & Footwear', pct: 22, color: '#b8860b' },
                    { name: 'Books & Stationery', pct: 18, color: '#1e7e34' },
                    { name: 'School Bags & Luggage', pct: 10, color: '#0b5ed7' },
                    { name: 'Lunchware & Tech Accessories', pct: 6, color: '#d37300' }
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
        {/* TAB 3: INVENTORY TRACKING & STOCK MANAGEMENT                   */}
        {/* ============================================================== */}
        {activeTab === 'inventory' && (
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
                  Inventory & Stock Manager
                </h2>
                <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '3px 0 0' }}>
                  Live multi-department inventory counts with threshold safety alerts.
                </p>
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="text"
                  placeholder="Search SKU or item name..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
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

            {/* Filter Chips */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: `All Items (${inventory.length})` },
                { id: 'LOW', label: `⚠️ Low Stock Alerts (${lowStockItems.length})` },
                { id: 'Uniforms', label: 'Uniforms' },
                { id: 'Shoes', label: 'Shoes' },
                { id: 'Books', label: 'Books' },
                { id: 'Stationery', label: 'Stationery' },
                { id: 'Bags', label: 'Bags' },
                { id: 'Lunchware', label: 'Lunchware' },
                { id: 'Electronics', label: 'Electronics' },
                { id: 'Sports', label: 'Sports' },
                { id: 'Travel', label: 'Travel' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setInventoryFilter(f.id)}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: '9999px',
                    fontSize: '0.76rem',
                    fontWeight: '700',
                    border: inventoryFilter === f.id ? '1px solid #800020' : '1px solid #e5e7eb',
                    backgroundColor: inventoryFilter === f.id ? '#800020' : '#ffffff',
                    color: inventoryFilter === f.id ? '#ffffff' : '#4b5563',
                    cursor: 'pointer'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Inventory Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb', color: '#4b5563' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Product Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Size / Option</th>
                    <th style={{ padding: '0.75rem 1rem' }}>SKU</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Price</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Current Stock</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Adjust</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid #f3f4f6',
                        backgroundColor: item.stock <= item.threshold ? '#fff8f8' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#111827' }}>
                        {item.name}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontSize: '0.74rem', backgroundColor: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: '#800020' }}>
                        {item.size}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#6b7280', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                        {item.sku}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '700' }}>
                        OMR {item.price.toFixed(3)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {editingId === item.id ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                            style={{ width: '70px', padding: '0.3rem', border: '1px solid #800020', borderRadius: '4px', fontWeight: '800' }}
                          />
                        ) : (
                          <span style={{ fontWeight: '900', fontSize: '1rem', color: item.stock <= item.threshold ? '#dc2626' : '#111827' }}>
                            {item.stock}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {item.stock <= item.threshold ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            color: '#dc2626',
                            fontWeight: '800',
                            fontSize: '0.74rem',
                            backgroundColor: '#fee2e2',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px'
                          }}>
                            <AlertTriangle size={13} />
                            <span>LOW STOCK</span>
                          </span>
                        ) : (
                          <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '0.76rem' }}>
                            In Stock
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {editingId === item.id ? (
                          <button
                            onClick={() => handleSaveStock(item.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.35rem 0.75rem',
                              backgroundColor: '#16a34a',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.78rem',
                              fontWeight: '700'
                            }}
                          >
                            <Save size={13} />
                            <span>Save</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => { setEditingId(item.id); setEditStock(item.stock.toString()); }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.35rem 0.75rem',
                              backgroundColor: '#f3f4f6',
                              color: '#374151',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.78rem',
                              fontWeight: '600'
                            }}
                          >
                            <Edit2 size={13} />
                            <span>Edit Stock</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#800020', margin: '0 0 1.25rem' }}>
              Customer Accounts & Purchasing History
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb', color: '#4b5563' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Customer Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Email Address</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Phone</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Orders Completed</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Lifetime Spend</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleCustomers.map((cust) => (
                    <tr key={cust.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#111827' }}>
                        {cust.name}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#4b5563' }}>
                        {cust.email}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#4b5563' }}>
                        {cust.phone}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#800020' }}>
                        {cust.ordersCount} Orders
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: '#15803d' }}>
                        OMR {cust.totalSpend}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          fontSize: '0.74rem',
                          fontWeight: '800',
                          backgroundColor: cust.status === 'VIP' ? '#fef3c7' : '#dcfce7',
                          color: cust.status === 'VIP' ? '#b45309' : '#15803d',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '9999px'
                        }}>
                          {cust.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
