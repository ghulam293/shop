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
  Heart,
  LogOut,
  ShieldAlert,
  Package,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useCart } from '../context/CartContext.js';

export default function Header() {
  const { lang, toggleLanguage, t, isRTL } = useLanguage();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, wishlist } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(1);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [uniformsMenuOpen, setUniformsMenuOpen] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const uniformsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (uniformsRef.current && !uniformsRef.current.contains(event.target)) {
        setUniformsMenuOpen(false);
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

  const isActive = (path) => location.pathname === path;

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

        {/* Left: Official Logo, School Name, School Shop Button */}
        <div className="header-left">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img
              src="/images/ips-logo.png"
              alt="International Pioneers School Crest"
              className="school-logo-img"
            />
            <div className="school-branding-text">
              <span className="school-name-ar">رواد العلم الدولية (صلالة)</span>
              <span className="school-name-en">International Pioneers School (Salalah)</span>
            </div>
          </Link>

          <div className="header-divider hide-mobile" />

          <Link to="/uniforms" className="btn-school-shop-pill hide-mobile">
            <ShoppingCart size={16} />
            <span>{t('schoolShop')}</span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="header-nav">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active-pill' : ''}`}
          >
            {t('home')}
          </Link>

          {/* Uniforms Navigation with Interactive Dropdown */}
          <div style={{ position: 'relative' }} ref={uniformsRef}>
            <button
              onClick={() => setUniformsMenuOpen(!uniformsMenuOpen)}
              onMouseEnter={() => setUniformsMenuOpen(true)}
              className={`nav-link ${isActive('/uniforms') || location.pathname.startsWith('/product') ? 'active-pill' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <span>{t('uniforms')}</span>
              <ChevronDown
                size={14}
                style={{
                  opacity: 0.7,
                  transform: uniformsMenuOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s'
                }}
              />
            </button>

            {uniformsMenuOpen && (
              <div
                className="dropdown-panel nav-dropdown"
                onMouseLeave={() => setUniformsMenuOpen(false)}
                style={{ minWidth: '240px' }}
              >
                <div className="dropdown-header">
                  <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#800020' }}>
                    {isRTL ? 'أزياء مدرسة الرواد' : 'IPS Uniform Items'}
                  </span>
                  <Link
                    to="/uniforms"
                    onClick={() => setUniformsMenuOpen(false)}
                    style={{ fontSize: '0.75rem', color: '#6b7280', textDecoration: 'underline' }}
                  >
                    {isRTL ? 'عرض الكل' : 'View All'}
                  </Link>
                </div>
                <div className="dropdown-body">
                  <Link
                    to="/uniforms"
                    onClick={() => setUniformsMenuOpen(false)}
                    className="dropdown-link"
                  >
                    <span>{isRTL ? 'جميع منتجات الزي المدرسي' : 'All Uniforms Catalog'}</span>
                  </Link>
                  <Link
                    to="/product/1"
                    onClick={() => setUniformsMenuOpen(false)}
                    className="dropdown-link"
                  >
                    <span>{isRTL ? 'قميص البولو العنابي (XS - XXL)' : 'IPS Polo Shirt (XS - XXL)'}</span>
                  </Link>
                  <Link
                    to="/product/2"
                    onClick={() => setUniformsMenuOpen(false)}
                    className="dropdown-link"
                    style={{ fontWeight: '600' }}
                  >
                    <span>{isRTL ? 'بناطيل الأولاد الرمادية (26" - 36")' : "Boys' Gray Trousers (26\" - 36\")"}</span>
                  </Link>
                  <Link
                    to="/product/3"
                    onClick={() => setUniformsMenuOpen(false)}
                    className="dropdown-link"
                  >
                    <span>{isRTL ? 'تنانير البنات الرمادية (26" - 36")' : "Girls' Pleated Skirt (26\" - 36\")"}</span>
                  </Link>
                  <Link
                    to="/uniforms?category=shoes"
                    onClick={() => setUniformsMenuOpen(false)}
                    className="dropdown-link"
                  >
                    <span>{isRTL ? 'الأحذية المدرسية (30 - 42)' : 'School Shoes (EU 30 - 42)'}</span>
                  </Link>
                  <Link
                    to="/uniforms?category=accessories"
                    onClick={() => setUniformsMenuOpen(false)}
                    className="dropdown-link"
                  >
                    <span>{isRTL ? 'الأحزمة والجوارب المدرسية' : 'School Belts & Socks'}</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/uniforms?category=stationery"
            className="nav-link"
          >
            {t('stationery')}
          </Link>

          <Link
            to="/uniforms?category=books"
            className="nav-link"
          >
            {t('books')}
          </Link>

          <Link
            to="/my-orders"
            className={`nav-link ${isActive('/my-orders') ? 'active-pill' : ''}`}
          >
            {t('myOrders')}
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={`nav-link ${isActive('/admin') ? 'active-pill' : ''}`}
              style={{ color: '#800020', fontWeight: '700' }}
            >
              <ShieldAlert size={15} />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Right: Search, Notifications, Cart, Parent Login, Language */}
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

          {/* Notifications Dropdown */}
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
                    {isRTL ? 'إشعارات المدرسة' : 'School Notifications'}
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
                        {isRTL ? 'الزي المدرسي المعتمد متوفر' : 'Approved Uniform Stock Ready'}
                      </p>
                      <p style={{ fontSize: '0.74rem', color: '#6b7280', margin: '2px 0 0' }}>
                        {isRTL
                          ? 'تتوفر مقاسات قمصان البولو والبناطيل والتنانير المعتمدة بفرع صلالة.'
                          : 'Full uniform sizing in stock for polo shirts, trousers, and skirts.'}
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

          {/* User Account / Parent Login Dropdown */}
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
                <span>{t('parentLogin')}</span>
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
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-link" style={{ color: '#800020', fontWeight: '600' }}>
                      <ShieldAlert size={16} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
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
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="mobile-drawer"
            onClick={(e) => e.stopPropagation()}
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          >
            <div className="mobile-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src="/images/ips-logo.png" alt="IPS" style={{ height: '36px' }} />
                <div>
                  <div style={{ fontWeight: '700', color: '#800020', fontSize: '0.9rem' }}>
                    رواد العلم الدولية
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#4b5563' }}>IPS Oman Shop</div>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} style={{ color: '#374151' }}>
                <X size={22} />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </form>

            <div className="mobile-drawer-links">
              <Link to="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}>
                {t('home')}
              </Link>
              <Link to="/uniforms" className={`mobile-nav-link ${isActive('/uniforms') ? 'active' : ''}`}>
                {t('uniforms')} (All)
              </Link>
              <Link to="/product/1" className="mobile-nav-link">
                {isRTL ? 'قميص البولو العنابي' : 'IPS Polo Shirt (Maroon)'}
              </Link>
              <Link to="/product/2" className="mobile-nav-link" style={{ fontWeight: '700', color: '#800020' }}>
                {isRTL ? 'بناطيل الأولاد الرمادية (26-36)' : "Boys' Gray Trousers (26-36)"}
              </Link>
              <Link to="/product/3" className="mobile-nav-link">
                {isRTL ? 'تنانير البنات الرمادية' : "Girls' Pleated Skirt"}
              </Link>
              <Link to="/uniforms?category=shoes" className="mobile-nav-link">
                {t('shoes')}
              </Link>
              <Link to="/uniforms?category=accessories" className="mobile-nav-link">
                {t('accessories')}
              </Link>
              <Link to="/uniforms?category=books" className="mobile-nav-link">
                {t('books')}
              </Link>
              <Link to="/uniforms?category=stationery" className="mobile-nav-link">
                {t('stationery')}
              </Link>
              <Link to="/my-orders" className={`mobile-nav-link ${isActive('/my-orders') ? 'active' : ''}`}>
                {t('myOrders')}
              </Link>
              {isAdmin && (
                <Link to="/admin" className="mobile-nav-link" style={{ color: '#800020', fontWeight: '700' }}>
                  Admin Dashboard
                </Link>
              )}
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
                  <span>{t('parentLogin')}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
