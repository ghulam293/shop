import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Lock,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('customer'); // 'customer' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || (activeTab === 'admin' ? '/admin' : '/');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const targetEmail = email.trim() || (activeTab === 'admin' ? 'admin@shop.com' : 'demo@shop.com');
    const targetPassword = password.trim() || (activeTab === 'admin' ? 'admin123' : 'customer123');

    const res = await login(targetEmail, targetPassword);
    if (res.success) {
      if (res.user.roles.includes('ADMIN')) {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(res.message || 'Login failed.');
    }
  };

  const handleQuickLogin = async (role) => {
    setError('');
    const demoEmail = role === 'admin' ? 'admin@shop.com' : 'demo@shop.com';
    const demoPass = role === 'admin' ? 'admin123' : 'customer123';
    
    const res = await login(demoEmail, demoPass);
    if (res.success) {
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(res.message || 'Login failed.');
    }
  };

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1.25rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(128, 0, 32, 0.08)',
        padding: '2.5rem 2rem',
        border: '1.5px solid #ebdada'
      }}>
        
        {/* App Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            backgroundColor: '#800020',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: '#ffffff',
            boxShadow: '0 6px 16px rgba(128, 0, 32, 0.25)'
          }}>
            <ShoppingCart size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#800020', margin: 0, letterSpacing: '-0.02em' }}>
            {isRTL ? 'المتجر' : 'Shop'}
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.4rem' }}>
            {isRTL ? 'تسجيل الدخول للمتابعة وإتمام الشراء' : 'Sign in to purchase & manage orders'}
          </p>
        </div>

        {/* Message Banner if redirected from cart or product page */}
        {location.state?.message && (
          <div style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            marginBottom: '1.5rem',
            color: '#92400e',
            fontSize: '0.85rem'
          }}>
            <Lock size={18} style={{ color: '#b45309', flexShrink: 0 }} />
            <span>{location.state.message}</span>
          </div>
        )}

        {/* 1-Click Instant Login Buttons */}
        <div style={{
          backgroundColor: '#fbf2f4',
          border: '1.5px solid #f4d3da',
          borderRadius: '14px',
          padding: '1.15rem 1rem',
          marginBottom: '1.75rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: '#800020',
            fontWeight: '800',
            fontSize: '0.82rem',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            <Sparkles size={16} color="#D4AF37" />
            <span>{isRTL ? 'تسجيل دخول تجريبي فوري بنقرة واحدة:' : '1-Click Instant Demo Login:'}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('customer')}
              style={{
                backgroundColor: '#800020',
                color: '#ffffff',
                border: 'none',
                padding: '0.7rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: '0 3px 8px rgba(128, 0, 32, 0.25)',
                transition: 'transform 0.15s'
              }}
            >
              <User size={15} />
              <span>{isRTL ? 'دخول كعميل' : 'Login as Customer'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              style={{
                backgroundColor: '#D4AF37',
                color: '#1a1a1a',
                border: 'none',
                padding: '0.7rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: '0 3px 8px rgba(212, 175, 55, 0.25)',
                transition: 'transform 0.15s'
              }}
            >
              <ShieldAlert size={15} />
              <span>{isRTL ? 'دخول كمسؤول' : 'Login as Admin'}</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher: Customer vs Admin */}
        <div style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          padding: '0.3rem',
          borderRadius: '10px',
          marginBottom: '1.5rem'
        }}>
          <button
            type="button"
            onClick={() => { setActiveTab('customer'); setEmail(''); setPassword(''); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'customer' ? '#ffffff' : 'transparent',
              color: activeTab === 'customer' ? '#800020' : '#64748b',
              fontWeight: activeTab === 'customer' ? '800' : '600',
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'customer' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s'
            }}
          >
            {isRTL ? 'حساب العميل' : 'Customer Login'}
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setEmail('admin@shop.com'); setPassword('admin123'); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'admin' ? '#ffffff' : 'transparent',
              color: activeTab === 'admin' ? '#800020' : '#64748b',
              fontWeight: activeTab === 'admin' ? '800' : '600',
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'admin' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s'
            }}
          >
            {isRTL ? 'إدارة المتجر' : 'Admin Portal'}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fee2e2',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#dc2626',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.4rem' }}>
              {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', [isRTL ? 'right' : 'left']: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                placeholder={activeTab === 'admin' ? 'admin@shop.com' : 'customer@shop.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: isRTL ? '0.75rem 2.6rem 0.75rem 1rem' : '0.75rem 1rem 0.75rem 2.6rem',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.4rem' }}>
              {isRTL ? 'كلمة المرور' : 'Password'}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', [isRTL ? 'right' : 'left']: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: isRTL ? '0.75rem 2.6rem 0.75rem 2.6rem' : '0.75rem 2.6rem 0.75rem 2.6rem',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  [isRTL ? 'left' : 'right']: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              backgroundColor: '#800020',
              color: '#ffffff',
              border: 'none',
              padding: '0.85rem',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: '800',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(128, 0, 32, 0.25)',
              opacity: loading ? 0.7 : 1
            }}
          >
            <span>{loading ? (isRTL ? 'جارٍ تسجيل الدخول...' : 'Signing in...') : (isRTL ? 'تسجيل الدخول الآن' : 'Sign In Now')}</span>
            <ArrowRight size={17} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
          </button>
        </form>

        {/* Footer info */}
        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.82rem', color: '#64748b' }}>
          <span>{isRTL ? 'تريد العودة إلى المتجر؟ ' : 'Want to browse products? '}</span>
          <Link to="/" style={{ color: '#800020', fontWeight: '800', textDecoration: 'none' }}>
            {isRTL ? 'تصفح الفئات' : 'Browse All Categories'}
          </Link>
        </div>

      </div>
    </div>
  );
}
