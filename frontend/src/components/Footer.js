import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

export default function Footer() {
  const { isRTL } = useLanguage();

  return (
    <footer style={{ backgroundColor: '#1a1a1a', color: '#e5e7eb', marginTop: 'auto', borderTop: '4px solid #800020' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 1.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          
          {/* Col 1: School Identity */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img
                src="/images/ips-logo.png"
                alt="IPS Logo"
                style={{ height: '48px', width: 'auto' }}
              />
              <div>
                <h4 style={{ color: '#D4AF37', fontSize: '1rem', fontWeight: '700' }}>
                  {isRTL ? 'مدرسة الرواد الدولية (صلالة)' : 'International Pioneers School'}
                </h4>
                <p style={{ color: '#9ca3af', fontSize: '0.78rem' }}>Salalah, Sultanate of Oman</p>
              </div>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.84rem', lineHeight: '1.6' }}>
              {isRTL
                ? 'المتجر الإلكتروني الرسمي للزي المدرسي المعتمد والكتب والمستلزمات التعليمية لطلاب مدرسة الرواد الدولية.'
                : 'Official school e-commerce portal providing approved uniforms, educational books, and school essentials for IPS students.'}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '2px solid #800020', paddingBottom: '0.4rem', display: 'inline-block' }}>
              {isRTL ? 'روابط سريعة' : 'School Shop Navigation'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.84rem' }}>
              <li><Link to="/uniforms" style={{ color: '#9ca3af', transition: 'color 0.2s' }}>{isRTL ? 'الزي المدرسي المعتمد' : 'Official Uniforms'}</Link></li>
              <li><Link to="/uniforms?category=shoes" style={{ color: '#9ca3af' }}>{isRTL ? 'الأحذية المدرسية' : 'School Shoes'}</Link></li>
              <li><Link to="/uniforms?category=accessories" style={{ color: '#9ca3af' }}>{isRTL ? 'الأحزمة والجوارب' : 'Belts & Socks'}</Link></li>
              <li><Link to="/my-orders" style={{ color: '#9ca3af' }}>{isRTL ? 'متابعة الطلبات' : 'Track My Orders'}</Link></li>
            </ul>
          </div>

          {/* Col 3: Contact & Campus Pickup */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '2px solid #800020', paddingBottom: '0.4rem', display: 'inline-block' }}>
              {isRTL ? 'الاستلام والتواصل' : 'Campus Pickup & Contact'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.84rem', color: '#9ca3af' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} style={{ color: '#D4AF37', marginTop: '2px', flexShrink: 0 }} />
                <span>School Uniform Store, Main Campus, Salalah, Dhofar Governorate, Oman</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} style={{ color: '#D4AF37', flexShrink: 0 }} />
                <span>Sun – Thu: 7:30 AM – 2:30 PM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} style={{ color: '#D4AF37', flexShrink: 0 }} />
                <span>+968 23 234567</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid #2d2d2d', paddingTop: '1.25rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: '#6b7280' }}>
          <p>© {new Date().getFullYear()} International Pioneers School (Salalah), Oman. All Rights Reserved.</p>
          <p style={{ color: '#D4AF37' }}>Approved IPS Oman School Uniforms & Educational Essentials</p>
        </div>
      </div>
    </footer>
  );
}

