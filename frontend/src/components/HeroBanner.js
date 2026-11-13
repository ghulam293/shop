import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, ShieldCheck, Truck, CreditCard, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

export default function HeroBanner() {
  const { isRTL } = useLanguage();

  return (
    <section className="classic-hero-section" style={{
      background: 'linear-gradient(135deg, #420312 0%, #68051e 50%, #800020 100%)',
      padding: '3.5rem 1.25rem 4rem',
      position: 'relative',
      color: '#ffffff',
      textAlign: 'center',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* Simple Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: 'rgba(212, 175, 55, 0.18)',
          border: '1px solid rgba(212, 175, 55, 0.45)',
          color: '#f7df8b',
          padding: '0.35rem 0.95rem',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: '600',
          marginBottom: '1.25rem'
        }}>
          <Sparkles size={14} color="#ffd700" />
          <span>{isRTL ? 'المتجر الإلكتروني المعتمد' : 'Official Online Store'}</span>
        </div>

        {/* ONLY SHOP NAME */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 4.5vw, 4rem)',
          fontWeight: '900',
          lineHeight: '1.15',
          margin: '0 0 1rem',
          letterSpacing: '-0.02em',
          color: '#ffffff'
        }}>
          {isRTL ? 'المتجر' : 'Shop'}
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1rem, 1.2vw, 1.2rem)',
          lineHeight: '1.6',
          color: '#f5e6ea',
          maxWidth: '720px',
          margin: '0 auto 2rem'
        }}>
          {isRTL
            ? 'وجهتكم الشاملة لتسوق الزي المدرسي المعتمد، الأحذية، الحقائب، الكتب والقرطاسية والمستلزمات مع خيارات دفع بالبطاقة البنكية أو نقداً عند الاستلام.'
            : 'Your premier destination for official uniforms, shoes, bags, books, stationery, and daily essentials with debit card & cash on delivery.'}
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}>
          <Link
            to="/uniforms"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              backgroundColor: '#ffd700',
              color: '#420312',
              fontWeight: '800',
              fontSize: '1rem',
              padding: '0.85rem 1.85rem',
              borderRadius: '9999px',
              textDecoration: 'none',
              boxShadow: '0 4px 18px rgba(255, 215, 0, 0.35)',
              transition: 'transform 0.15s ease'
            }}
          >
            <ShoppingCart size={19} />
            <span>{isRTL ? 'تسوق المنتجات الآن' : 'Shop Products Now'}</span>
            <ArrowRight size={17} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
          </Link>

          <a
            href="#categories"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '1rem',
              padding: '0.85rem 1.65rem',
              borderRadius: '9999px',
              textDecoration: 'none',
              backdropFilter: 'blur(6px)'
            }}
          >
            <span>{isRTL ? 'تصفح الفئات' : 'Browse Categories'}</span>
          </a>
        </div>

        {/* Quick Highlights Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
          paddingTop: '1.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.18)',
          fontSize: '0.88rem',
          color: '#f9f0f2'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="#ffd700" />
            <span>{isRTL ? 'جودة معتمدة ١٠٠٪' : '100% Quality Guaranteed'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={18} color="#ffd700" />
            <span>{isRTL ? 'بطاقة بنكية والدفع عند الاستلام' : 'Debit Card & Cash on Delivery'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Truck size={18} color="#ffd700" />
            <span>{isRTL ? 'توصيل واستلام سريع' : 'Fast Delivery & Store Pickup'}</span>
          </div>
        </div>

      </div>
    </section>
  );
}
