import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';

export default function MyOrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const { t, isRTL } = useLanguage();

  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem('ips_orders') || '[]');
      if (savedOrders.length > 0) {
        setOrders(savedOrders);
      } else {
        setOrders([
          {
            orderNumber: 'ORD-2026-92810',
            date: '09 Nov 2026',
            paymentStatus: 'PAID',
            paymentMethod: 'Debit Card',
            total: '16.500',
            items: [
              { nameEn: 'Maroon Polo Shirt', nameAr: 'قميص بولو عنابي', size: 'M', quantity: 1, price: 6.500 },
              { nameEn: "Boys' Gray Trousers", nameAr: 'بنطال رمادي للأولاد', size: '30', quantity: 1, price: 7.500 },
              { nameEn: 'School Belt (Black)', nameAr: 'حزام مدرسي أسود', size: 'Standard', quantity: 1, price: 2.500 }
            ]
          }
        ]);
      }
    } catch (e) {
      console.warn('Error reading saved orders', e);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
        <Package size={48} style={{ color: '#800020', margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>
          {isRTL ? 'تسجيل الدخول مطلوب' : 'Authentication Required'}
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '1.5rem' }}>
          {isRTL ? 'يرجى تسجيل الدخول إلى حسابك لعرض وتتبع طلباتك.' : 'Please sign in to your account to view and track your orders.'}
        </p>
        <Link to="/login" className="btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
          {isRTL ? 'تسجيل الدخول' : 'Sign In to View Orders'}
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
      <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#800020', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Package size={24} />
        <span>{t('myOrders')}</span>
      </h1>
      <p style={{ fontSize: '0.86rem', color: '#6b7280', marginBottom: '2rem' }}>
        {isRTL ? 'تتبع طلباتك الرسمية وتفاصيل السداد وحالة التوصيل.' : 'Track your official orders, payment details and delivery status.'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {orders.map((ord, idx) => (
          <div key={idx} style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#800020' }}>#{ord.orderNumber}</span>
                <span style={{ fontSize: '0.82rem', color: '#6b7280', marginLeft: '0.75rem' }}>Placed on {ord.date}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{
                  backgroundColor: ord.paymentStatus === 'PAID' ? '#dcfce7' : '#fef3c7',
                  color: ord.paymentStatus === 'PAID' ? '#15803d' : '#b45309',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '700'
                }}>
                  {ord.paymentStatus === 'PAID' ? (isRTL ? 'مدفوع بالبطاقة' : 'PAID (Card)') : (isRTL ? 'نقداً عند الاستلام' : 'COD (Cash)')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
              {(ord.items || []).map((item, itemIdx) => (
                <div key={itemIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span>{(isRTL ? (item.nameAr || item.name_ar) : (item.nameEn || item.name_en || item.name))} (Size: <strong>{item.size}</strong>) × {item.quantity || item.qty}</span>
                  <span style={{ fontWeight: '700' }}>OMR {((item.price || item.base_price || 0) * (item.quantity || item.qty || 1)).toFixed(3)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #e5e7eb', paddingTop: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#16a34a' }}>
                <CheckCircle size={16} />
                <span>{isRTL ? 'طلب مؤكد وجارٍ التجهيز للتسليم' : 'Order confirmed & prepared for fulfillment'}</span>
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#800020' }}>
                OMR {ord.total}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

