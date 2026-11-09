import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

export default function HeroBanner() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="hero-section">
      {/* 1. Original School Building Photo (Preserved exactly as supplied) */}
      <img
        src="/images/school-building-hero.jpg"
        alt="International Pioneers School Building, Salalah"
        className="hero-background-img"
      />

      {/* 2. Soft Gradient Overlay for crisp text contrast */}
      <div className="hero-gradient-overlay" />

      {/* 3. Hero Text & Shop Now Button */}
      <div className="hero-content-container">
        <div className="hero-text-block">
          <h1 className="hero-heading">
            {isRTL ? (
              <>
                مدرسة الرواد<br />
                متجر المدرسة
              </>
            ) : (
              <>
                IPS Oman<br />
                School Shopping
              </>
            )}
          </h1>

          <p className="hero-subtitle">
            {isRTL ? (
              <>
                الزي المدرسي والمستلزمات<br />
                التعليمية الرسمية والمعتمدة
              </>
            ) : (
              <>
                Official School Uniforms &<br />
                Educational Essentials
              </>
            )}
          </p>

          <Link to="/uniforms" className="btn-hero-shop-now">
            <ShoppingCart size={19} />
            <span>{t('shopNow')}</span>
            <ArrowRight size={19} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
          </Link>
        </div>
      </div>

      {/* 4. Sweeping Maroon Curved Wave Divider */}
      <div className="hero-wave-divider">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="hero-wave-svg"
        >
          {/* Deep Maroon Wave curve matching reference design */}
          <path
            d="M0,45 C320,58 750,55 1440,8 L1440,60 L0,60 Z"
            fill="#800020"
          />
        </svg>
      </div>
    </section>
  );
}

