import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShoppingCart, ShieldCheck, CreditCard, Banknote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

export default function Footer() {
  const { isRTL } = useLanguage();

  return (
    <footer style={{ backgroundColor: '#111827', color: '#e5e7eb', marginTop: 'auto', borderTop: '3px solid #800020' }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '3rem 1.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          
          {/* Col 1: Only Shop Name */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#ffd700', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <ShoppingCart size={22} color="#ffd700" />
                {isRTL ? 'المتجر' : 'Shop'}
              </span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: '1.65', marginBottom: '1.25rem' }}>
              {isRTL
                ? 'متجر إلكتروني متكامل يوفر أزياء المدارس، الأحذية، الحقائب، الكتب، القرطاسية وكافة المستلزمات اليومية بجودة مضمونة.'
                : 'Your comprehensive shopping destination for school uniforms, footwear, backpacks, books, stationery, and daily essentials.'}
            </p>
            {/* Accepted Payments */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#1f2937',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                color: '#f3f4f6'
              }}>
                <CreditCard size={15} color="#ffd700" />
                Debit / Credit Card
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#1f2937',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                color: '#f3f4f6'
              }}>
                <Banknote size={15} color="#ffd700" />
                Cash on Delivery
              </span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '2px solid #800020', paddingBottom: '0.4rem', display: 'inline-block' }}>
              {isRTL ? 'الفئات الرئيسية' : 'Popular Categories'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.45rem', fontSize: '0.82rem' }}>
              <Link to="/uniforms?category=school-uniforms" style={{ color: '#9ca3af', textDecoration: 'none' }}>• Uniforms & Shirts</Link>
              <Link to="/uniforms?category=boys-trousers" style={{ color: '#9ca3af', textDecoration: 'none' }}>• Boys' Trousers</Link>
              <Link to="/uniforms?category=girls-skirts" style={{ color: '#9ca3af', textDecoration: 'none' }}>• Girls' Pleated Skirts</Link>
              <Link to="/uniforms?category=shoes" style={{ color: '#9ca3af', textDecoration: 'none' }}>• Leather School Shoes</Link>
              <Link to="/uniforms?category=accessories" style={{ color: '#9ca3af', textDecoration: 'none' }}>• Belts, Ties & Socks</Link>
              <Link to="/uniforms?category=stationery-books" style={{ color: '#9ca3af', textDecoration: 'none' }}>• Books & Stationery</Link>
            </div>
          </div>

          {/* Col 3: Customer Service */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '2px solid #800020', paddingBottom: '0.4rem', display: 'inline-block' }}>
              {isRTL ? 'خدمة العملاء' : 'Customer Care'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem', color: '#9ca3af' }}>
              <Link to="/my-orders" style={{ color: '#9ca3af', textDecoration: 'none' }}>• {isRTL ? 'تتبع الطلبات' : 'Order Tracking'}</Link>
              <Link to="/cart" style={{ color: '#9ca3af', textDecoration: 'none' }}>• {isRTL ? 'سلة التسوق' : 'Shopping Cart'}</Link>
              <Link to="/login" style={{ color: '#9ca3af', textDecoration: 'none' }}>• {isRTL ? 'تسجيل الدخول' : 'Account Login'}</Link>
              <span>• {isRTL ? 'سياسة استبدال المقاسات خلال ٧ أيام' : '7-Day Size Exchange Policy'}</span>
              <span>• {isRTL ? 'دفع آمن بالبطاقة أو نقداً' : 'Secure Card & Cash on Delivery'}</span>
            </div>
          </div>

          {/* Col 4: Operations & Hours */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '2px solid #800020', paddingBottom: '0.4rem', display: 'inline-block' }}>
              {isRTL ? 'أوقات العمل والتواصل' : 'Hours & Support'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.84rem', color: '#9ca3af' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} style={{ color: '#ffd700', flexShrink: 0 }} />
                <span>Sat – Thu: 8:00 AM – 8:00 PM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} style={{ color: '#ffd700', flexShrink: 0 }} />
                <span>100% Guaranteed Satisfaction</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} style={{ color: '#ffd700', flexShrink: 0 }} />
                <span>support@shop.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #1f2937',
          paddingTop: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.78rem',
          color: '#6b7280'
        }}>
          <p>© {new Date().getFullYear()} Shop. All Rights Reserved.</p>
          <p style={{ color: '#ffd700' }}>{isRTL ? 'دفع بالبطاقة البنكية • نقداً عند الاستلام' : 'Debit Card • Cash on Delivery'}</p>
        </div>
      </div>
    </footer>
  );
}
