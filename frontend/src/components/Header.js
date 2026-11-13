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
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useCart } from '../context/CartContext.js';

export default function Header() {
  const { toggleLanguage, t, isRTL } = useLanguage();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
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

  const allCategoryPoints = [
    { id: 'uniforms', nameEn: 'Uniforms', nameAr: 'الزي المدرسي', link: '/uniforms?category=school-uniforms', icon: '👕', badge: 'Official' },
    { id: 'trousers', nameEn: "Boys' Trousers", nameAr: 'بناطيل الأولاد', link: '/uniforms?category=boys-trousers', icon: '👖', badge: 'Fit' },
    { id: 'skirts', nameEn: "Girls' Skirts", nameAr: 'تنانير البنات', link: '/uniforms?category=girls-skirts', icon: '👗', badge: 'Pleated' },
    { id: 'shoes', nameEn: 'Shoes & Footwear', nameAr: 'الأحذية المدرسية', link: '/uniforms?category=shoes', icon: '👞', badge: 'Leather' },
    { id: 'accessories', nameEn: 'Accessories', nameAr: 'الإكسسوارات', link: '/uniforms?category=accessories', icon: '🎗️', badge: 'Belts & Socks' },
    { id: 'books', nameEn: 'Books & Stationery', nameAr: 'الكتب والقرطاسية', link: '/uniforms?category=stationery-books', icon: '📚', badge: 'Curriculum' },
    { id: 'bags', nameEn: 'Bags & Backpacks', nameAr: 'الحقائب المدرسية', link: '/uniforms?category=school-bags', icon: '🎒', badge: 'Ergonomic' },
    { id: 'lunchware', nameEn: 'Lunchware & Bottles', nameAr: 'علب ومطارات الطعام', link: '/uniforms?category=lunch-boxes', icon: '🍱', badge: 'BPA-Free' },
    { id: 'electronics', nameEn: 'Electronics & Tech', nameAr: 'الإلكترونيات والتقنية', link: '/uniforms?category=electronics', icon: '⚡', badge: 'Calculators' },
    { id: 'sports', nameEn: 'Sports & Fitness', nameAr: 'اللياقة والرياضة', link: '/uniforms?category=fitness-sports', icon: '🏃', badge: 'Athletic' },
    { id: 'travel', nameEn: 'Travel & Outdoor', nameAr: 'السفر والرحلات', link: '/uniforms?category=travel-outdoor', icon: '🧳', badge: 'Gear' }
  ];

  return (
    <header className="header-wrapper">
      <div className="header-container">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Left: Only Shop Name - No Logo */}
        <div className="header-left">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <span style={{
              fontSize: '1.45rem',
              fontWeight: '900',
              color: '#800020',
              letterSpacing: '-0.02em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}>
              <ShoppingCart size={24} color="#800020" />
              <span>{isRTL ? 'المتجر' : 'Shop'}</span>
            </span>
          </Link>

          <div className="header-divider hide-mobile" />

          <Link to="/uniforms" className="btn-school-shop-pill hide-mobile">
            <Sparkles size={14} color="#ffd700" />
            <span>{isRTL ? 'تسوق المنتجات' : 'All Products'}</span>
          </Link>
        </div>

        {/* Center: Desktop Navigation with Specific Points & Markdown Dropdown */}
        <nav className="header-nav">
          {/* Specific Point 1: Home */}
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active-pill' : ''}`}
          >
            {t('home')}
          </Link>

          {/* Specific Point 2: Categories with Markdown Dropdown */}
          <div style={{ position: 'relative' }} ref={categoriesRef}>
            <button
              onClick={() => setCategoriesMenuOpen(!categoriesMenuOpen)}
              onMouseEnter={() => setCategoriesMenuOpen(true)}
              className={`nav-link ${location.search.includes('category') ? 'active-pill' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Layers size={14} />
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
                style={{ minWidth: '340px', maxHeight: '460px', overflowY: 'auto', padding: '0.6rem 0' }}
              >
                <div className="dropdown-header" style={{ padding: '0.6rem 1rem', borderBottom: '1.5px solid #f3e8eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#800020' }}>
                    {isRTL ? 'جميع الأقسام والفئات (11 قسماً)' : 'All 11 Categories & Departments'}
                  </span>
                  <Link
                    to="/uniforms"
                    onClick={() => setCategoriesMenuOpen(false)}
                    style={{ fontSize: '0.74rem', color: '#800020', fontWeight: '700', textDecoration: 'underline' }}
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
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#800020', backgroundColor: '#fcf2f4', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        {item.badge}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Specific Point 3: Uniforms */}
          <Link
            to="/uniforms?category=school-uniforms"
            className={`nav-link ${location.search.includes('school-uniforms') ? 'active-pill' : ''}`}
          >
            {isRTL ? 'الزي المدرسي' : 'Uniforms'}
          </Link>

          {/* Specific Point 4: Shoes */}
          <Link
            to="/uniforms?category=shoes"
            className={`nav-link ${location.search.includes('shoes') ? 'active-pill' : ''}`}
          >
            {isRTL ? 'الأحذية' : 'Shoes'}
          </Link>

          {/* Specific Point 5: Books & Stationery */}
          <Link
            to="/uniforms?category=stationery-books"
            className={`nav-link ${location.search.includes('stationery-books') ? 'active-pill' : ''}`}
          >
            {isRTL ? 'الكتب والقرطاسية' : 'Books & Stationery'}
          </Link>

          {/* Specific Point 6: Electronics */}
          <Link
            to="/uniforms?category=electronics"
            className={`nav-link ${location.search.includes('electronics') ? 'active-pill' : ''}`}
          >
            {isRTL ? 'الإلكترونيات' : 'Electronics'}
          </Link>

          {/* Specific Point 7: Sports */}
          <Link
            to="/uniforms?category=fitness-sports"
            className={`nav-link ${location.search.includes('fitness-sports') ? 'active-pill' : ''}`}
          >
            {isRTL ? 'الرياضة' : 'Sports'}
          </Link>

          {/* Specific Point 8: My Orders */}
          <Link
            to="/my-orders"
            className={`nav-link ${isActive('/my-orders') ? 'active-pill' : ''}`}
          >
            {t('myOrders')}
          </Link>

          {/* Specific Point 9: Admin Dashboard */}
          <Link
            to="/admin"
            className={`nav-link ${isActive('/admin') ? 'active-pill' : ''}`}
            style={{ color: '#800020', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <ShieldAlert size={15} />
            <span>{isRTL ? 'لوحة التحكم' : 'Admin'}</span>
          </Link>
        </nav>

        {/* Right: Search, Notifications, Cart, Login & Language */}
        <div className="header-right">
          {/* Search Input Pill */}
          <form onSubmit={handleSearchSubmit} className="search-box-pill hide-mobile">
            <button
              type="submit"
              title="Search"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Search size={15} className="search-icon-inside" />
            </button>
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-pill"
            />
          </form>

          {/* Store Notifications Dropdown */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              className="icon-btn-round"
              title="Notifications"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell size={18} />
              {unreadNotifs > 0 && <span className="badge-count">{unreadNotifs}</span>}
            </button>

            {notificationsOpen && (
              <div className="dropdown-panel notif-dropdown">
                <div className="dropdown-header">
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#800020', margin: 0 }}>
                    {isRTL ? 'إشعارات المتجر' : 'Store Notifications'}
                  </h4>
                  {unreadNotifs > 0 ? (
                    <button
                      onClick={() => setUnreadNotifs(0)}
                      style={{ fontSize: '0.74rem', color: '#800020', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                    >
                      {isRTL ? 'تحديد كمقروء' : 'Mark as read'}
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.74rem', color: '#6b7280' }}>All read</span>
                  )}
                </div>
                <div className="dropdown-body">
                  <div className={`notif-item ${unreadNotifs > 0 ? 'unread' : ''}`}>
                    <CheckCircle2 size={18} style={{ color: '#800020', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: '0.82rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                        {isRTL ? 'جميع المنتجات والمقاسات متوفرة' : 'Store Collection in Stock'}
                      </p>
                      <p style={{ fontSize: '0.74rem', color: '#6b7280', margin: '2px 0 0' }}>
                        {isRTL
                          ? 'تتوفر مقاسات الزي الرسمي، الأحذية، الحقائب والكتب والقرطاسية مع خياري الدفع بالبطاقة أو نقداً عند الاستلام.'
                          : 'Uniforms, shoes, bags, books and accessories in stock with debit card & cash on delivery.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Shopping Cart Pill */}
          <Link to="/cart" className="icon-btn-round" title={t('cart')}>
            <ShoppingCart size={18} />
            {itemCount > 0 && <span className="badge-count">{itemCount}</span>}
          </Link>

          {/* User Account / Login Dropdown */}
          <div style={{ position: 'relative' }} ref={userMenuRef}>
            {isAuthenticated ? (
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="btn-parent-login"
                style={{ backgroundColor: isAdmin ? '#D4AF37' : '#800020', color: isAdmin ? '#111' : '#fff' }}
              >
                <User size={16} />
                <span>{user.fullName ? user.fullName.split(' ')[0] : 'Account'}</span>
                <ChevronDown size={14} />
              </button>
            ) : (
              <Link to="/login" className="btn-parent-login">
                <User size={16} />
                <span>{isRTL ? 'تسجيل الدخول' : 'Login'}</span>
              </Link>
            )}

            {userMenuOpen && isAuthenticated && (
              <div className="dropdown-panel user-dropdown">
                <div className="dropdown-header">
                  <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                    {user.fullName}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '2px 0 0' }}>
                    {user.email}
                  </p>
                </div>
                <div className="dropdown-body" style={{ padding: '0.4rem 0' }}>
                  <Link to="/admin" className="dropdown-link" style={{ color: '#800020', fontWeight: '600' }}>
                    <ShieldAlert size={16} />
                    <span>{isRTL ? 'لوحة التحكم للمسؤول' : 'Admin Dashboard'}</span>
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
          >
            {isRTL ? 'English' : 'عربي'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer with Specific Points & Sub-points */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="mobile-drawer"
            onClick={(e) => e.stopPropagation()}
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          >
            <div className="mobile-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: '900', color: '#800020', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShoppingCart size={22} color="#800020" />
                  {isRTL ? 'المتجر' : 'Shop'}
                </span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} style={{ color: '#374151', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>
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
                🛍️ {isRTL ? 'جميع المنتجات (المتجر)' : 'All Products (Shop)'}
              </Link>

              <div style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: '800', color: '#800020', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isRTL ? 'الأقسام والفئات:' : 'Departments & Categories:'}
              </div>

              {allCategoryPoints.map((item) => (
                <Link key={item.id} to={item.link} className="mobile-nav-link" style={{ paddingInlineStart: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{item.icon} {isRTL ? item.nameAr : item.nameEn}</span>
                  <span style={{ fontSize: '0.7rem', color: '#800020', fontWeight: '700' }}>{item.badge}</span>
                </Link>
              ))}

              <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '0.5rem 0' }} />

              <Link to="/my-orders" className={`mobile-nav-link ${isActive('/my-orders') ? 'active' : ''}`}>
                📦 {t('myOrders')}
              </Link>
              <Link to="/admin" className="mobile-nav-link" style={{ color: '#800020', fontWeight: '700' }}>
                🛡️ {isRTL ? 'لوحة التحكم للمسؤول' : 'Admin Dashboard'}
              </Link>
            </div>

            <div className="mobile-drawer-footer">
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
                  style={{ width: '100%', textDecoration: 'none' }}
                >
                  <User size={16} />
                  <span>{isRTL ? 'تسجيل الدخول' : 'Login'}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
