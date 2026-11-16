import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  LogOut,
  ShieldAlert,
  Package,
  CheckCircle2,
  Sparkles,
  Layers,
  Truck,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useCart } from '../context/CartContext.js';

export default function Header() {
  const { toggleLanguage, t, isRTL } = useLanguage();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, cartAlert } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(1);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const categoriesRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setCategoriesMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/uniforms?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || (path.includes('?') && `${location.pathname}${location.search}` === path);
  };

  // The 11 curated collections
  const allCategoryPoints = [
    { id: 'uniforms', nameEn: '1. Apparel & Clothing', nameAr: '1. الملابس والأزياء', link: '/uniforms?category=school-uniforms', icon: '👕', badge: 'Apparel' },
    { id: 'trousers', nameEn: "• Boys' Trousers", nameAr: '• بناطيل الأولاد', link: '/uniforms?category=boys-trousers', icon: '👖', badge: 'Fit' },
    { id: 'skirts', nameEn: "• Girls' Skirts", nameAr: '• تنانير البنات', link: '/uniforms?category=girls-skirts', icon: '👗', badge: 'Pleated' },
    { id: 'shoes', nameEn: '• Shoes & Footwear', nameAr: '• الأحذية الرسمية والجلدية', link: '/uniforms?category=shoes', icon: '👞', badge: 'Leather' },
    { id: 'accessories', nameEn: '• Belts & Socks', nameAr: '• أحزمة وجوارب', link: '/uniforms?category=accessories', icon: '🎗️', badge: 'Accessories' },
    { id: 'bags', nameEn: '2. Bags & Backpacks', nameAr: '2. الحقائب وحقائب الظهر', link: '/uniforms?category=school-bags', icon: '🎒', badge: 'Ergonomic' },
    { id: 'books', nameEn: '3. Stationery & Books', nameAr: '3. الكتب والقرطاسية', link: '/uniforms?category=stationery-books', icon: '📚', badge: 'Cambridge' },
    { id: 'lunchware', nameEn: '4. Lunch Boxes & Drinkware', nameAr: '4. علب الطعام ومطارات المشروبات', link: '/uniforms?category=lunch-boxes', icon: '🍱', badge: 'BPA-Free' },
    { id: 'healthcare', nameEn: '5. Healthcare & Personal Care', nameAr: '5. الرعاية الصحية والعناية', link: '/uniforms?category=healthcare', icon: '🩺', badge: 'First-Aid' },
    { id: 'sports', nameEn: '6. Fitness & Sports Equipment', nameAr: '6. اللياقة والرياضة', link: '/uniforms?category=fitness-sports', icon: '🏃', badge: 'Athletic' },
    { id: 'electronics', nameEn: '7. Electronics & Mobile', nameAr: '7. الإلكترونيات وملحقات الهاتف', link: '/uniforms?category=electronics', icon: '⚡', badge: 'Exam Tech' },
    { id: 'toys', nameEn: '8. Toys & Educational', nameAr: '8. ألعاب الذكاء والتعليم', link: '/uniforms?category=toys-educational', icon: '🧩', badge: 'STEM' },
    { id: 'craft', nameEn: '9. Gifts, Art & Craft', nameAr: '9. الهدايا والأعمال الفنية', link: '/uniforms?category=gifts-craft', icon: '🎨', badge: 'Creative' },
    { id: 'household', nameEn: '10. Household & Daily', nameAr: '10. المستلزمات المنزلية', link: '/uniforms?category=household', icon: '🏠', badge: 'Storage' },
    { id: 'travel', nameEn: '11. Travel & Outdoor', nameAr: '11. السفر والرحلات', link: '/uniforms?category=travel-outdoor', icon: '🧳', badge: 'Luggage' }
  ];

  return (
    <header className="header-wrapper" style={{ backgroundColor: '#ffffff', borderBottom: '1.5px solid #ebdada', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(158, 42, 43, 0.04)' }}>
      <div className="header-container" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        
        {/* Left: Hamburger & Clean Shop Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#1e293b' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <span style={{
              fontSize: '1.55rem',
              fontWeight: '900',
              color: '#9E2A2B',
              letterSpacing: '-0.03em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}>
              <ShoppingCart size={26} color="#9E2A2B" />
              <span>{isRTL ? 'المتجر' : 'Shop'}</span>
            </span>
          </Link>
        </div>

        {/* Center: Clean, Fluid Navigation (No Overflow on Laptops) */}
        <nav className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'nowrap' }}>
          {/* Point 1: Home */}
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active-pill' : ''}`}
          >
            {t('home')}
          </Link>

          {/* Point 2: Categories Dropdown */}
          <div style={{ position: 'relative' }} ref={categoriesRef}>
            <button
              onClick={() => setCategoriesMenuOpen(!categoriesMenuOpen)}
              onMouseEnter={() => setCategoriesMenuOpen(true)}
              className={`nav-link ${location.search.includes('category') ? 'active-pill' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Layers size={15} />
              <span>{isRTL ? 'الفئات والأقسام' : 'Categories'}</span>
              <ChevronDown
                size={14}
                style={{
                  opacity: 0.7,
                  transform: categoriesMenuOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s'
                }}
              />
            </button>

            {categoriesMenuOpen && (
              <div
                className="dropdown-panel nav-dropdown"
                onMouseLeave={() => setCategoriesMenuOpen(false)}
                style={{ minWidth: '340px', maxHeight: '460px', overflowY: 'auto', padding: '0.6rem 0', borderRadius: '12px', border: '1.5px solid #ebdada' }}
              >
                <div className="dropdown-header" style={{ padding: '0.65rem 1rem', borderBottom: '1.5px solid #f3e8eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#9E2A2B' }}>
                    {isRTL ? 'جميع الفئات' : 'All Categories'}
                  </span>
                  <Link
                    to="/uniforms"
                    onClick={() => setCategoriesMenuOpen(false)}
                    style={{ fontSize: '0.74rem', color: '#9E2A2B', fontWeight: '700', textDecoration: 'underline' }}
                  >
                    {isRTL ? 'عرض الكل' : 'View All'}
                  </Link>
                </div>
                <div className="dropdown-body" style={{ padding: '0.4rem 0.5rem' }}>
                  {allCategoryPoints.map((item) => (
                    <Link
                      key={item.id}
                      to={item.link}
                      onClick={() => setCategoriesMenuOpen(false)}
                      className="dropdown-link"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.86rem', fontWeight: '600', color: '#1f2937' }}>
                        <span>{item.icon}</span>
                        <span>{isRTL ? item.nameAr : item.nameEn}</span>
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#9E2A2B', backgroundColor: '#fdf2f4', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        {item.badge}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Point 3: Shop / Catalog */}
          <Link
            to="/uniforms"
            className={`nav-link ${isActive('/uniforms') && !location.search.includes('category') ? 'active-pill' : ''}`}
          >
            {isRTL ? 'المتجر' : 'Shop'}
          </Link>

          {/* Point 4 & 5: Track Order & My Orders - ONLY SHOWN WHEN LOGGED IN */}
          {isAuthenticated && (
            <>
              <Link
                to="/track-order"
                className={`nav-link ${isActive('/track-order') ? 'active-pill' : ''}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Truck size={15} />
                <span>{isRTL ? 'تتبع الطلب' : 'Track Order'}</span>
              </Link>

              <Link
                to="/my-orders"
                className={`nav-link ${isActive('/my-orders') ? 'active-pill' : ''}`}
              >
                {t('myOrders')}
              </Link>
            </>
          )}

          {/* Point 6: Admin Dashboard - EXCLUSIVELY SHOWN TO ADMINISTRATORS */}
          {isAdmin && (
            <Link
              to="/admin"
              className={`nav-link ${isActive('/admin') ? 'active-pill' : ''}`}
              style={{ color: '#9E2A2B', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <ShieldAlert size={15} />
              <span>{isRTL ? 'لوحة التحكم' : 'Admin'}</span>
            </Link>
          )}
        </nav>

        {/* Right Controls: Search, Notifications, Cart, User Login, Language */}
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
          
          {/* Search Input Pill */}
          <form onSubmit={handleSearchSubmit} className="search-box-pill hide-mobile" style={{ position: 'relative' }}>
            <button
              type="submit"
              title="Search"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Search size={15} className="search-icon-inside" style={{ color: '#94a3b8' }} />
            </button>
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-pill"
              style={{
                width: '135px',
                padding: isRTL ? '0.4rem 2rem 0.4rem 0.75rem' : '0.4rem 0.75rem 0.4rem 2rem',
                borderRadius: '9999px',
                border: '1px solid #d1d5db',
                fontSize: '0.82rem',
                outline: 'none',
                backgroundColor: '#f8fafc'
              }}
              onFocus={(e) => { e.target.style.width = '180px'; e.target.style.borderColor = '#9E2A2B'; }}
              onBlur={(e) => { e.target.style.width = '135px'; e.target.style.borderColor = '#d1d5db'; }}
            />
          </form>

          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              className="icon-btn-round"
              title="Notifications"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', position: 'relative', color: '#334155' }}
            >
              <Bell size={18} />
              {unreadNotifs > 0 && (
                <span style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', backgroundColor: '#9E2A2B', borderRadius: '50%' }} />
              )}
            </button>

            {notificationsOpen && (
              <div className="dropdown-panel notif-dropdown" style={{ right: 0, minWidth: '300px', borderRadius: '12px', border: '1.5px solid #ebdada' }}>
                <div className="dropdown-header" style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#9E2A2B', margin: 0 }}>
                    {isRTL ? 'إشعارات المتجر' : 'Store Notifications'}
                  </h4>
                </div>
                <div className="dropdown-body" style={{ padding: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={18} color="#9E2A2B" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <p style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                        {isRTL ? 'تتبع الطلبات متاح الآن مباشرة' : 'Order Tracking Live'}
                      </p>
                      <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0' }}>
                        {isRTL ? 'يمكنك الآن تتبع حالة وتوصيل شحنتك لحظة بلحظة.' : 'Track the live delivery route of your order anytime.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Shopping Cart Pill - Cannot open cart without login */}
          <Link
            to={isAuthenticated ? '/cart' : '/login'}
            state={!isAuthenticated ? { from: { pathname: '/cart' }, message: isRTL ? 'يرجى تسجيل الدخول أولاً للوصول إلى سلة التسوق.' : 'Please log in to open your shopping cart.' } : undefined}
            title={t('cart')}
            style={{
              position: 'relative',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#334155',
              textDecoration: 'none'
            }}
          >
            <ShoppingCart size={18} />
            {itemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: '#9E2A2B',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: '800',
                padding: '1px 5px',
                borderRadius: '9999px',
                minWidth: '16px',
                textAlign: 'center'
              }}>
                {itemCount}
              </span>
            )}
          </Link>

          {/* User Account / Login Pill — WHITE-SPACE NOWRAP ENSURES NO 'Lo...' TRUNCATION */}
          <div style={{ position: 'relative' }} ref={userMenuRef}>
            {isAuthenticated ? (
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: isAdmin ? '#D4AF37' : '#9E2A2B',
                  color: isAdmin ? '#111' : '#fff',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '9999px',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <User size={15} />
                <span>{user.fullName ? user.fullName.split(' ')[0] : 'Account'}</span>
                <ChevronDown size={13} />
              </button>
            ) : (
              <Link
                to="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#9E2A2B',
                  color: '#ffffff',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '9999px',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(158, 42, 43, 0.2)'
                }}
              >
                <User size={15} />
                <span>{isRTL ? 'تسجيل الدخول' : 'Login'}</span>
              </Link>
            )}

            {userMenuOpen && isAuthenticated && (
              <div className="dropdown-panel user-dropdown" style={{ right: 0, minWidth: '220px', borderRadius: '12px', border: '1.5px solid #ebdada' }}>
                <div className="dropdown-header" style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                    {user.fullName}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '2px 0 0' }}>
                    {user.email}
                  </p>
                </div>
                <div className="dropdown-body" style={{ padding: '0.4rem 0' }}>
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-link" style={{ color: '#9E2A2B', fontWeight: '700' }}>
                      <ShieldAlert size={16} />
                      <span>{isRTL ? 'لوحة التحكم للمسؤول' : 'Admin Dashboard'}</span>
                    </Link>
                  )}
                  <Link to="/track-order" className="dropdown-link">
                    <Truck size={16} />
                    <span>{isRTL ? 'تتبع الطلب' : 'Track Order'}</span>
                  </Link>
                  <Link to="/my-orders" className="dropdown-link">
                    <Package size={16} />
                    <span>{t('myOrders')}</span>
                  </Link>
                  <Link to="/cart" className="dropdown-link">
                    <ShoppingCart size={16} />
                    <span>{t('cart')} ({itemCount})</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                      navigate('/');
                    }}
                    className="dropdown-link"
                    style={{ width: '100%', border: 'none', background: 'none', color: '#dc2626' }}
                  >
                    <LogOut size={16} />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="btn-lang-toggle"
            title="Switch Language"
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '9999px',
              border: '1px solid #d1d5db',
              fontSize: '0.78rem',
              fontWeight: '700',
              color: '#9E2A2B',
              backgroundColor: '#fdf8f9',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {isRTL ? 'English' : 'عربي'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation with Track Order & All Departments */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="mobile-drawer"
            onClick={(e) => e.stopPropagation()}
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          >
            <div className="mobile-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: '900', color: '#9E2A2B', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShoppingCart size={22} color="#9E2A2B" />
                  {isRTL ? 'المتجر' : 'Shop'}
                </span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} style={{ color: '#374151', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', [isRTL ? 'right' : 'left']: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: isRTL ? '0.6rem 2.25rem 0.6rem 0.75rem' : '0.6rem 0.75rem 0.6rem 2.25rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </form>

            <div className="mobile-drawer-links" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <Link to="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}>
                🏠 {t('home')} (All Categories)
              </Link>
              <Link to="/uniforms" className={`mobile-nav-link ${isActive('/uniforms') ? 'active' : ''}`}>
                🛍️ {isRTL ? 'المتجر والمنتجات' : 'Shop All Products'}
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/track-order" className={`mobile-nav-link ${isActive('/track-order') ? 'active' : ''}`}>
                    🚚 {isRTL ? 'تتبع الطلب المباشر' : 'Track Order Live'}
                  </Link>
                  <Link to="/my-orders" className={`mobile-nav-link ${isActive('/my-orders') ? 'active' : ''}`}>
                    📦 {t('myOrders')}
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin" className="mobile-nav-link" style={{ color: '#9E2A2B', fontWeight: '700' }}>
                  🛡️ {isRTL ? 'لوحة التحكم للمسؤول' : 'Admin Dashboard'}
                </Link>
              )}

              <div style={{ padding: '0.65rem 1rem 0.35rem', fontSize: '0.75rem', fontWeight: '800', color: '#9E2A2B', textTransform: 'uppercase' }}>
                {isRTL ? 'فئات المنتجات:' : 'Product Categories:'}
              </div>

              {allCategoryPoints.map((item) => (
                <Link key={item.id} to={item.link} className="mobile-nav-link" style={{ paddingInlineStart: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{item.icon} {isRTL ? item.nameAr : item.nameEn}</span>
                  <span style={{ fontSize: '0.7rem', color: '#9E2A2B', fontWeight: '700' }}>{item.badge}</span>
                </Link>
              ))}
            </div>

            <div className="mobile-drawer-footer" style={{ padding: '1rem', borderTop: '1px solid #e2e8f0' }}>
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="btn-primary"
                  style={{ width: '100%', backgroundColor: '#dc2626' }}
                >
                  <LogOut size={16} />
                  <span>{t('logout')}</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="btn-primary"
                  style={{ width: '100%', textDecoration: 'none', backgroundColor: '#9E2A2B' }}
                >
                  <User size={16} />
                  <span>{isRTL ? 'تسجيل الدخول' : 'Login'}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Private Cart Notification Toast (Only notified when adding to cart, only for this person) */}
      {cartAlert && cartAlert.show && (
        <div style={{
          position: 'fixed',
          top: '75px',
          right: isRTL ? 'auto' : '20px',
          left: isRTL ? '20px' : 'auto',
          zIndex: 9999,
          backgroundColor: '#15803d',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '0.85rem 1.35rem',
          boxShadow: '0 8px 24px rgba(21, 128, 61, 0.28)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          maxWidth: '380px'
        }}>
          <CheckCircle2 size={22} color="#ffffff" style={{ flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, fontWeight: '800', fontSize: '0.88rem' }}>
              {isRTL ? 'تمت الإضافة إلى سلتك!' : 'Added to Your Cart!'}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', opacity: 0.95 }}>
              {cartAlert.productName} ({isRTL ? 'المقاس:' : 'Size:'} {cartAlert.size}) × {cartAlert.quantity}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
