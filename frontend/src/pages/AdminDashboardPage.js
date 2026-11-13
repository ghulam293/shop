import React, { useState } from 'react';
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
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';

export default function AdminDashboardPage() {
  const { user, isAdmin, logout } = useAuth();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');

  // Realistic initial administrative mock data (synchronized with seed.sql)
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: 'IPS-2026-92810',
      parentName: 'Salim Al-Shanfari',
      parentPhone: '+968 91234567',
      itemsCount: 3,
      itemsSummary: 'Polo Shirt (M), Boys Trousers (30), Belt',
      totalAmount: '16.500',
      status: 'PENDING',
      fulfillment: 'Campus Pickup',
      createdAt: '2026-11-09 18:40'
    },
    {
      id: 2,
      orderNumber: 'IPS-2026-84192',
      parentName: 'Fatima Al-Kathiri',
      parentPhone: '+968 92345678',
      itemsCount: 2,
      itemsSummary: 'Girls Skirt (28), White Socks (M)',
      totalAmount: '8.500',
      status: 'READY_FOR_PICKUP',
      fulfillment: 'Campus Pickup',
      createdAt: '2026-11-09 14:15'
    },
    {
      id: 3,
      orderNumber: 'IPS-2026-71049',
      parentName: 'Mohammed Al-Rawas',
      parentPhone: '+968 93456789',
      itemsCount: 4,
      itemsSummary: 'Polo Shirt (L), Boys Shoes (36), 2x Socks',
      totalAmount: '18.000',
      status: 'COMPLETED',
      fulfillment: 'Campus Pickup',
      createdAt: '2026-11-08 10:20'
    }
  ]);

  const [inventory, setInventory] = useState([
    { id: 1, name: 'Maroon Polo Shirt', size: 'XS', stock: 45, threshold: 5, sku: 'POLO-XS' },
    { id: 2, name: 'Maroon Polo Shirt', size: 'S',  stock: 60, threshold: 10, sku: 'POLO-S' },
    { id: 3, name: 'Maroon Polo Shirt', size: 'M',  stock: 85, threshold: 10, sku: 'POLO-M' },
    { id: 4, name: 'Maroon Polo Shirt', size: 'L',  stock: 70, threshold: 10, sku: 'POLO-L' },
    { id: 5, name: 'Boys\' Gray Trousers', size: '28', stock: 40, threshold: 5, sku: 'IPS-TRSR-28' },
    { id: 6, name: 'Boys\' Gray Trousers', size: '30', stock: 55, threshold: 8, sku: 'IPS-TRSR-30' },
    { id: 7, name: 'Girls\' Gray Skirt', size: '28',  stock: 45, threshold: 5, sku: 'IPS-SKRT-28' },
    { id: 8, name: 'Girls\' Gray Skirt', size: '30',  stock: 60, threshold: 8, sku: 'IPS-SKRT-30' },
    { id: 9, name: 'Boys\' Black Shoes', size: '36',   stock: 35, threshold: 5, sku: 'IPS-BSHOE-36' },
    { id: 10, name: 'Girls\' Mary Jane Shoes', size: '34', stock: 4, threshold: 5, sku: 'IPS-GSHOE-34' }, // low stock
    { id: 11, name: 'School Belt (Black)', size: 'Standard', stock: 120, threshold: 15, sku: 'IPS-BELT-STD' },
    { id: 12, name: 'School Socks (White)', size: 'M (34-38)', stock: 200, threshold: 20, sku: 'IPS-SOCK-M' }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState('');

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

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0).toFixed(3);
  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING').length;
  const lowStockCount = inventory.filter(i => i.stock <= i.threshold).length;

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: 'calc(100vh - 120px)', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Admin Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', backgroundColor: '#ffffff', padding: '1.25rem 1.75rem', borderRadius: '14px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '44px', height: '44px', backgroundColor: '#fdf2f4', color: '#800020', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#800020', margin: 0 }}>
                Shop — Administration
              </h1>
              <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '2px 0 0' }}>
                International Pioneers School, Salalah • Admin: {user?.email || 'admin@ipsoman.com'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/" className="btn-gold" style={{ padding: '0.5rem 1rem', fontSize: '0.84rem' }}>
              View Storefront
            </Link>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.85rem', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '600', cursor: 'pointer' }}
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
          {[
            { id: 'overview', label: 'Dashboard Overview' },
            { id: 'orders', label: `Manage Orders (${orders.length})` },
            { id: 'inventory', label: `Inventory Stock (${lowStockCount} Low)` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.88rem',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? '#800020' : '#ffffff',
                color: activeTab === tab.id ? '#ffffff' : '#4b5563',
                boxShadow: activeTab === tab.id ? '0 2px 6px rgba(128,0,32,0.2)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: '600' }}>TOTAL PRODUCTS</div>
                <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#111', marginTop: '0.35rem' }}>7 Active</div>
                <div style={{ fontSize: '0.74rem', color: '#16a34a', marginTop: '0.25rem' }}>Official Approved Uniforms</div>
              </div>

              <div style={{ backgroundColor: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: '600' }}>PENDING ORDERS</div>
                <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#d97706', marginTop: '0.35rem' }}>{pendingOrdersCount} Orders</div>
                <div style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '0.25rem' }}>Awaiting counter collection</div>
              </div>

              <div style={{ backgroundColor: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: '600' }}>TOTAL REVENUE</div>
                <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#800020', marginTop: '0.35rem' }}>OMR {totalRevenue}</div>
                <div style={{ fontSize: '0.74rem', color: '#16a34a', marginTop: '0.25rem' }}>3-Decimal Omani Rial</div>
              </div>

              <div style={{ backgroundColor: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: '600' }}>LOW-STOCK ALERTS</div>
                <div style={{ fontSize: '1.85rem', fontWeight: '800', color: lowStockCount > 0 ? '#dc2626' : '#16a34a', marginTop: '0.35rem' }}>
                  {lowStockCount} Variants
                </div>
                <div style={{ fontSize: '0.74rem', color: '#dc2626', marginTop: '0.25rem' }}>Below threshold limit</div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827', margin: '0 0 1rem' }}>
                Recent Parent Uniform Orders
              </h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb', color: '#4b5563' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Order #</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Parent & Phone</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Items Summary</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Total (OMR)</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#800020' }}>
                          #{order.orderNumber}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: '600', color: '#111' }}>{order.parentName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{order.parentPhone}</div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: '#374151' }}>{order.itemsSummary}</td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#800020' }}>OMR {order.totalAmount}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{
                            padding: '0.3rem 0.65rem',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            backgroundColor: order.status === 'COMPLETED' ? '#dcfce7' : order.status === 'READY_FOR_PICKUP' ? '#dbeafe' : '#fef3c7',
                            color: order.status === 'COMPLETED' ? '#16a34a' : order.status === 'READY_FOR_PICKUP' ? '#1d4ed8' : '#b45309'
                          }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.78rem' }}
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

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#800020', margin: '0 0 1.25rem' }}>
              All School Orders Management
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Order Number</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Parent Details</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Fulfillment</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Total Amount</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#800020' }}>#{o.orderNumber}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div><strong>{o.parentName}</strong></div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{o.parentPhone}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>{o.fulfillment}</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#800020' }}>OMR {o.totalAmount}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          backgroundColor: o.status === 'COMPLETED' ? '#dcfce7' : o.status === 'READY_FOR_PICKUP' ? '#dbeafe' : '#fef3c7',
                          color: o.status === 'COMPLETED' ? '#16a34a' : o.status === 'READY_FOR_PICKUP' ? '#1d4ed8' : '#b45309'
                        }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                          style={{ padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.78rem' }}
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

        {/* Tab 3: Inventory */}
        {activeTab === 'inventory' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#800020', margin: '0 0 1.25rem' }}>
              Uniforms Inventory & Stock Tracking
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Product Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Size</th>
                    <th style={{ padding: '0.75rem 1rem' }}>SKU</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Current Stock</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Threshold</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Stock Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: item.stock <= item.threshold ? '#fff8f8' : 'transparent' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '600' }}>{item.name}</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#800020' }}>{item.size}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#6b7280', fontSize: '0.78rem' }}>{item.sku}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {editingId === item.id ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                            style={{ width: '70px', padding: '0.3rem', border: '1px solid #800020', borderRadius: '4px' }}
                          />
                        ) : (
                          <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{item.stock}</span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#6b7280' }}>{item.threshold}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {item.stock <= item.threshold ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#dc2626', fontWeight: '700', fontSize: '0.74rem', backgroundColor: '#fee2e2', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                            <AlertTriangle size={13} />
                            <span>LOW STOCK</span>
                          </span>
                        ) : (
                          <span style={{ color: '#16a34a', fontWeight: '600', fontSize: '0.74rem' }}>Adequate</span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {editingId === item.id ? (
                          <button
                            onClick={() => handleSaveStock(item.id)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.65rem', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem' }}
                          >
                            <Save size={13} />
                            <span>Save</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => { setEditingId(item.id); setEditStock(item.stock.toString()); }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.65rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem' }}
                          >
                            <Edit2 size={13} />
                            <span>Adjust</span>
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

      </div>
    </div>
  );
}

