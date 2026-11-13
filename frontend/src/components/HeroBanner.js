import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Sparkles, Layers, ShieldCheck, Truck, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

export default function HeroBanner() {
  const { isRTL } = useLanguage();

  return (
    <section className="classic-hero-section">
      {/* Background Subtle Geometric Watermark */}
      <div className="hero-emblem-watermark" aria-hidden="true">
        <img
          src="/images/company-emblem.png"
          alt=""
          className="watermark-emblem-img"
        />
      </div>

      <div className="classic-hero-container">
        {/* Left Column: Brand Statement & Departments */}
        <div className="classic-hero-content">
          {/* Official Company Badge */}
          <div className="hero-company-badge">
            <Sparkles size={14} className="gold-sparkle" />
            <span>
              {isRTL
                ? 'تمكين الابتكارات الدولية (ش.م.م) • المتجر الشامل'
                : 'Empowering International Innovations (L.L.C) • Premier Multi-Department Shop'}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="classic-hero-title">
            {isRTL ? (
              <>
                وجهتكم الشاملة لتسوق<br />
                <span className="gold-text-shimmer">11 قسماً متخصصاً</span> في مكان واحد
              </>
            ) : (
              <>
                Bringing 11 Essential<br />
                <span className="gold-text-shimmer">Product Departments</span> Together
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="classic-hero-subtitle">
            {isRTL
              ? 'متجر متكامل يجمع مستلزمات المدارس، العائلة، التكنولوجيا، الصحة، اللياقة البدنية، المستلزمات المنزلية وأدوات السفر والرحلات في زيارة واحدة تلبي كافة تطلعاتكم.'
              : 'A curated destination where you can shop school apparel, bags, books, tech accessories, lunchware, healthcare, fitness, household, and travel gear in a single seamless experience.'}
          </p>

          {/* Department Chips Preview */}
          <div className="hero-department-chips">
            <span className="dept-chip">🎒 School & Clothing</span>
            <span className="dept-chip">📚 Stationery & Books</span>
            <span className="dept-chip">🍱 Lunch & Drinkware</span>
            <span className="dept-chip">⚡ Tech & Mobile</span>
            <span className="dept-chip">🩺 Healthcare</span>
            <span className="dept-chip">🏃 Fitness & Sports</span>
            <span className="dept-chip">🧳 Travel & Outdoor</span>
          </div>

          {/* CTAs */}
          <div className="hero-cta-group">
            <a href="#departments" className="btn-hero-primary">
              <Layers size={18} />
              <span>{isRTL ? 'استكشف الأقسام الـ 11' : 'Explore 11 Departments'}</span>
              <ArrowRight size={17} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
            </a>

            <Link to="/uniforms" className="btn-hero-secondary">
              <ShoppingCart size={18} />
              <span>{isRTL ? 'تسوق المنتجات الآن' : 'Shop Available Catalog'}</span>
            </Link>
          </div>

          {/* Mini Trust Metrics */}
          <div className="hero-metrics-strip">
            <div className="metric-item">
              <Award size={18} className="metric-icon" />
              <div>
                <span className="metric-val">11</span>
                <span className="metric-lbl">{isRTL ? 'أقسام متخصصة' : 'Departments'}</span>
              </div>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <ShieldCheck size={18} className="metric-icon" />
              <div>
                <span className="metric-val">100%</span>
                <span className="metric-lbl">{isRTL ? 'جودة معتمدة' : 'Verified Quality'}</span>
              </div>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <Truck size={18} className="metric-icon" />
              <div>
                <span className="metric-val">{isRTL ? 'توصيل واستلام' : 'Delivery & Pickup'}</span>
                <span className="metric-lbl">{isRTL ? 'خدمة مريحة' : 'Convenient Fulfillment'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Prestigious Emblem Card */}
        <div className="classic-hero-showcase">
          <div className="emblem-card-frame">
            <div className="emblem-card-glow" />
            <div className="emblem-card-inner">
              <div className="emblem-icon-ring">
                <img
                  src="/images/company-emblem.png"
                  alt="Empowering International Innovations Seal"
                  className="showcase-emblem-img"
                />
              </div>

              <h3 className="showcase-company-en">
                Empowering International Innovations
              </h3>
              <p className="showcase-company-ar">
                تمكين الابتكارات الدولية (ش.م.م)
              </p>

              <div className="showcase-badge-pill">
                <span>Core Launch • 11 Departments</span>
              </div>

              <div className="showcase-quick-list">
                <div className="quick-item">
                  <span className="quick-num">01</span>
                  <span className="quick-text">School Uniforms & Clothing</span>
                </div>
                <div className="quick-item">
                  <span className="quick-num">02</span>
                  <span className="quick-text">School Bags & Accessories</span>
                </div>
                <div className="quick-item">
                  <span className="quick-num">03</span>
                  <span className="quick-text">Stationery & Textbooks</span>
                </div>
                <div className="quick-item">
                  <span className="quick-num">04</span>
                  <span className="quick-text">Lunch Boxes & Drinkware</span>
                </div>
                <div className="quick-item">
                  <span className="quick-num">07</span>
                  <span className="quick-text">Electronics & Mobile Accessories</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Elegant Bottom Gold Wave Ribbon */}
      <div className="hero-gold-ribbon">
        <svg viewBox="0 0 1440 40" fill="none" preserveAspectRatio="none" className="ribbon-svg">
          <path
            d="M0,20 C360,38 720,5 1080,25 C1260,35 1380,15 1440,20 L1440,40 L0,40 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  );
}
