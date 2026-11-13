import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Layers, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

export default function Footer() {
  const { isRTL } = useLanguage();

  return (
    <footer style={{ backgroundColor: '#111827', color: '#e5e7eb', marginTop: 'auto', borderTop: '4px solid #D4AF37' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3.5rem 1.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          
          {/* Col 1: Company Identity */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <img
                src="/images/company-emblem.png"
                alt="Empowering International Innovations"
                style={{ height: '52px', width: 'auto' }}
              />
              <div>
                <h4 style={{ color: '#D4AF37', fontSize: '1.05rem', fontWeight: '800', margin: 0 }}>
                  {isRTL ? 'تمكين الابتكارات الدولية (ش.م.م)' : 'Empowering International Innovations (L.L.C)'}
                </h4>
                <p style={{ color: '#9ca3af', fontSize: '0.78rem', margin: '3px 0 0' }}>
                  {isRTL ? 'متجر الأقسام المتكاملة' : 'Premier Multi-Department Shop'}
                </p>
              </div>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.84rem', lineHeight: '1.65' }}>
              {isRTL
                ? 'متجر متكامل يجمع أحد عشر قسماً رئيسياً لتلبية احتياجات الطلاب، العائلات، المعلمين ومحبي الرياضة والسفر في تجربة تسوق واحدة وراقية.'
                : 'A convenient retail destination bringing eleven product departments together in one place: school, family, health, fitness, technology, household, and travel essentials.'}
            </p>
          </div>

          {/* Col 2: The 11 Departments */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '2px solid #800020', paddingBottom: '0.4rem', display: 'inline-block' }}>
              {isRTL ? 'أقسام المتجر الـ 11' : '11 Retail Departments'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.45rem', fontSize: '0.82rem' }}>
              <Link to="/uniforms?category=school-uniforms" style={{ color: '#9ca3af', textDecoration: 'none' }}>1. School Uniforms & Clothing</Link>
              <Link to="/uniforms?category=school-bags" style={{ color: '#9ca3af', textDecoration: 'none' }}>2. School Bags & Accessories</Link>
              <Link to="/uniforms?category=stationery-books" style={{ color: '#9ca3af', textDecoration: 'none' }}>3. Stationery & Books</Link>
              <Link to="/uniforms?category=lunch-boxes" style={{ color: '#9ca3af', textDecoration: 'none' }}>4. Lunch Boxes & Drinkware</Link>
              <Link to="/uniforms?category=healthcare" style={{ color: '#9ca3af', textDecoration: 'none' }}>5. Healthcare & Personal Care</Link>
              <Link to="/uniforms?category=fitness-sports" style={{ color: '#9ca3af', textDecoration: 'none' }}>6. Fitness & Sports Equipment</Link>
              <Link to="/uniforms?category=electronics" style={{ color: '#9ca3af', textDecoration: 'none' }}>7. Electronics & Mobile Accessories</Link>
              <Link to="/uniforms?category=travel-outdoor" style={{ color: '#9ca3af', textDecoration: 'none' }}>8-11. Toys, Gifts, Home & Travel</Link>
            </div>
          </div>

          {/* Col 3: Customer Groups & Services */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '2px solid #800020', paddingBottom: '0.4rem', display: 'inline-block' }}>
              {isRTL ? 'فئات العملاء والخدمات' : 'Customer Groups Served'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', color: '#9ca3af' }}>
              <li>• <strong>Students & Parents:</strong> Uniforms, bags, lunchware & books</li>
              <li>• <strong>Teachers & Schools:</strong> Classroom materials & stationery</li>
              <li>• <strong>Office Workers:</strong> Computer accessories & chargers</li>
              <li>• <strong>Fitness Customers:</strong> Sports gear & drinkware</li>
              <li>• <strong>Travellers & Outdoors:</strong> Luggage, organizers & gear</li>
              <li>• <strong>General Shoppers:</strong> Tech, gifts & household items</li>
            </ul>
          </div>

          {/* Col 4: Contact & Operations */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '2px solid #800020', paddingBottom: '0.4rem', display: 'inline-block' }}>
              {isRTL ? 'التواصل وخدمة العملاء' : 'Support & Operations'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.84rem', color: '#9ca3af' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} style={{ color: '#D4AF37', marginTop: '2px', flexShrink: 0 }} />
                <span>Empowering International Innovations (L.L.C), Customer Support & Fulfillment</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} style={{ color: '#D4AF37', flexShrink: 0 }} />
                <span>Working Hours: Sat – Thu: 8:00 AM – 8:00 PM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} style={{ color: '#D4AF37', flexShrink: 0 }} />
                <span>support@empoweringinnovations.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} style={{ color: '#D4AF37', flexShrink: 0 }} />
                <span>Written Exchange, Warranty & Return Policy</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid #1f2937', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#6b7280' }}>
          <p>© {new Date().getFullYear()} Empowering International Innovations (L.L.C) • تمكين الابتكارات الدولية (ش.م.م). All Rights Reserved.</p>
          <p style={{ color: '#D4AF37' }}>Phase 1 Core Launch • 11 Product Departments</p>
        </div>
      </div>
    </footer>
  );
}
