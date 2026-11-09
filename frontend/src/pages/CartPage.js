import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck, MapPin, CheckCircle, Package, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';

export default function CartPage() {
  const { items, itemCount, subtotal, shippingFee, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [orderPlaced, setOrderPlaced] = useState(null);
  const [fulfillment, setFulfillment] = useState('SCHOOL_PICKUP');
  const [paymentMethod, setPaymentMethod] = useState('SCHOOL_COUNTER_CASH');

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: { pathname: '/cart' },
          message: isRTL ? 'يرجى تسجيل الدخول أولاً لإتمام الشراء والطلب.' : 'Please log in to complete your purchase and place your order.'
        }
      });
      return;
    }

    const orderNumber = `IPS-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      orderNumber,
      items: [...items],
      total,
      fulfillment,
      paymentMethod,
      date: new Date().toLocaleDateString('en-GB')
    };

    setOrderPlaced(newOrder);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div style={{ maxWidth: '640px', margin: '4rem auto', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <div style={{ width: '70px', height: '70px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <CheckCircle size={40} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#800020', marginBottom: '0.5rem' }}>
          {isRTL ? 'تم استلام طلبكم بنجاح!' : 'Order Placed Successfully!'}
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#4b5563', marginBottom: '1.5rem' }}>
          Order Reference: <strong style={{ color: '#111827' }}>#{orderPlaced.orderNumber}</strong>
        </p>
        <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem', textAlign: 'left', marginBottom: '2rem' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.88rem' }}><strong>Campus Pickup:</strong> International Pioneers School Store, Salalah</p>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.88rem' }}><strong>Fulfillment:</strong> {orderPlaced.fulfillment === 'SCHOOL_PICKUP' ? 'School Campus Pickup (Free)' : 'Home Delivery'}</p>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.88rem' }}><strong>Payment:</strong> Pay at School Cashier Counter on Collection</p>
          <p style={{ margin: '0', fontSize: '0.95rem', color: '#800020', fontWeight: '700' }}><strong>Total:</strong> OMR {orderPlaced.total}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/uniforms" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            Continue Shopping
          </Link>
          <button onClick={() => setOrderPlaced(null)} className="btn-gold" style={{ padding: '0.75rem 1.5rem' }}>
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '5rem auto', padding: '2rem', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: '#fdf2f4', color: '#800020', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <ShoppingCart size={40} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>
          {isRTL ? 'سلة التسوق فارغة' : 'Your Shopping Cart is Empty'}
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '2rem' }}>
          {isRTL
            ? 'لم تقم بإضافة أي من الزي المدرسي أو المستلزمات التعليمية حتى الآن.'
            : 'Browse the approved school uniform collection and select your sizes to get started.'}
        </p>
        <Link to="/uniforms" className="btn-primary" style={{ padding: '0.8rem 1.75rem', fontSize: '0.95rem' }}>
          <Package size={18} />
          <span>{isRTL ? 'تصفح الزي المدرسي المعتمد' : 'Browse Official Uniforms'}</span>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#800020', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShoppingCart size={24} />
        <span>{t('cart')} ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                gap: '1.25rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '1.25rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              <img
                src={item.image}
                alt={item.nameEn}
                style={{ width: '90px', height: '90px', objectFit: 'contain', backgroundColor: '#f9fafb', borderRadius: '8px', padding: '0.35rem' }}
              />

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                  {isRTL ? item.nameAr : item.nameEn}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '3px 0 8px' }}>
                  SKU: {item.sku || 'IPS-UNIF'} • Size: <strong style={{ color: '#800020' }}>{item.size}</strong>
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {/* Quantity Stepper */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px', overflow: 'hidden' }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{ padding: '0.3rem 0.65rem', backgroundColor: '#f3f4f6', cursor: 'pointer', border: 'none' }}
                    >
                      -
                    </button>
                    <span style={{ padding: '0.3rem 0.85rem', fontSize: '0.88rem', fontWeight: '600' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ padding: '0.3rem 0.65rem', backgroundColor: '#f3f4f6', cursor: 'pointer', border: 'none' }}
                    >
                      +
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: '700', color: '#800020' }}>
                      OMR {(item.price * item.quantity).toFixed(3)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                      style={{ color: '#9ca3af', border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#111827', margin: '0 0 1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
            Order Summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
              <span>Items Subtotal:</span>
              <span>OMR {subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
              <span>School Campus Pickup:</span>
              <span style={{ color: '#16a34a', fontWeight: '600' }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: '800', color: '#800020', borderTop: '2px dashed #e5e7eb', paddingTop: '0.85rem' }}>
              <span>Total Amount:</span>
              <span>OMR {total}</span>
            </div>
          </div>

          {/* Fulfillment options */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#374151', marginBottom: '0.5rem' }}>
              Fulfillment Method:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem', border: '1px solid #800020', borderRadius: '8px', backgroundColor: '#fdf8f9' }}>
                <input
                  type="radio"
                  name="fulfillment"
                  value="SCHOOL_PICKUP"
                  checked={fulfillment === 'SCHOOL_PICKUP'}
                  onChange={(e) => setFulfillment(e.target.value)}
                />
                <div>
                  <strong>Campus Store Pickup (Recommended)</strong>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>Collect from IPS Salalah Uniform Counter</div>
                </div>
              </label>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', fontSize: '1rem', fontWeight: '700' }}
          >
            {isAuthenticated ? <ArrowRight size={18} /> : <Lock size={18} />}
            <span>{isAuthenticated ? (isRTL ? 'تأكيد طلب المدرسة' : 'Confirm School Order') : (isRTL ? 'تسجيل الدخول لإتمام الطلب' : 'Login to Place Order')}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: '#6b7280', fontSize: '0.75rem', justifyContent: 'center' }}>
            <ShieldCheck size={16} style={{ color: '#16a34a' }} />
            <span>Official International Pioneers School System</span>
          </div>
        </div>

      </div>
    </div>
  );
}

