import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';

export default function MyOrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const { t, isRTL } = useLanguage();

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
        <Package size={48} style={{ color: '#800020', margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>
          Parent Authentication Required
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '1.5rem' }}>
          Please sign in to your parent account to track your school uniform orders.
        </p>
        <Link to="/login" className="btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
          Sign In to View Orders
        </Link>
      </div>
    );
  }

  const sampleOrders = [
    {
      id: 1,
      orderNumber: 'IPS-2026-92810',
      date: '09 Nov 2026',
      status: 'PENDING',
      total: '16.500',
      items: [
        { name: 'IPS Maroon Polo Shirt', size: 'M', qty: 1, price: '6.500' },
        { name: "Boys' Gray Trousers", size: '30', qty: 1, price: '7.500' },
        { name: 'School Belt (Black)', size: 'Standard', qty: 1, price: '2.500' }
      ]
    }
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
      <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#800020', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Package size={24} />
        <span>{t('myOrders')}</span>
      </h1>
      <p style={{ fontSize: '0.86rem', color: '#6b7280', marginBottom: '2rem' }}>
        Track your official school uniform orders for International Pioneers School, Salalah.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {sampleOrders.map((ord) => (
          <div key={ord.id} style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#800020' }}>#{ord.orderNumber}</span>
                <span style={{ fontSize: '0.82rem', color: '#6b7280', marginLeft: '0.75rem' }}>Placed on {ord.date}</span>
              </div>
              <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700' }}>
                {ord.status}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
              {ord.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span>{item.name} (Size: <strong>{item.size}</strong>) × {item.qty}</span>
                  <span style={{ fontWeight: '700' }}>OMR {item.price}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #e5e7eb', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#16a34a' }}>
                <MapPin size={16} />
                <span>Ready for campus collection upon confirmation</span>
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#800020' }}>
                Total: OMR {ord.total}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

