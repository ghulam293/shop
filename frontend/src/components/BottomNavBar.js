import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';

export default function BottomNavBar() {
  const location = useLocation();
  const { isRTL } = useLanguage();
  const { itemCount } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      id: 'home',
      labelEn: 'Home',
      labelAr: 'الرئيسية',
      path: '/',
      icon: Home
    },
    {
      id: 'categories',
      labelEn: 'Categories',
      labelAr: 'الفئات',
      path: '/uniforms',
      icon: Grid
    },
    {
      id: 'shop',
      labelEn: 'Shop',
      labelAr: 'المتجر',
      path: '/uniforms',
      icon: ShoppingBag
    },
    {
      id: 'cart',
      labelEn: 'Cart',
      labelAr: 'السلة',
      path: '/cart',
      icon: ShoppingCart,
      badge: itemCount
    },
    {
      id: 'account',
      labelEn: isAdmin ? 'Admin' : 'Account',
      labelAr: isAdmin ? 'لوحة التحكم' : 'حسابي',
      path: isAdmin ? '/admin' : (isAuthenticated ? '/my-orders' : '/login'),
      icon: User
    }
  ];

  return (
    <nav className="mobile-bottom-app-bar" aria-label="Mobile Navigation">
      <div className="bottom-bar-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`bottom-nav-item ${active ? 'active' : ''}`}
            >
              <div className="bottom-nav-icon-wrap">
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                {item.badge > 0 && (
                  <span className="bottom-nav-badge">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="bottom-nav-label">
                {isRTL ? item.labelAr : item.labelEn}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
