import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Lock,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
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
  const [lockState, setLockState] = useState(null);

  const from = location.state?.from?.pathname || (activeTab === 'admin' ? '/admin' : '/');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLockState(null);

    const targetEmail = email.trim();
    const targetPassword = password.trim();

    if (!targetEmail || !targetPassword) {
      setError(isRTL ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور.' : 'Please enter your email and password.');
      return;
    }

    const res = await login(targetEmail, targetPassword);
    if (res.success) {
      if (res.user && res.user.roles && res.user.roles.includes('ADMIN')) {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(res.message || 'Login failed.');
      if (res.isLocked || res.attemptsRemaining !== undefined) {
        setLockState({
          isLocked: res.isLocked,
          attempts: res.attempts,
          attemptsRemaining: res.attemptsRemaining
        });
      }
    }
  };

  const autofillCredentials = (role) => {
    setError('');
    setLockState(null);
    if (role === 'admin') {
      setActiveTab('admin');
      setEmail('admin@shop.com');
      setPassword('admin123');
    } else {
      setActiveTab('customer');
      setEmail('customer@shop.com');
      setPassword('password123');
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
          <h2 style={{ fontSize: '1.65rem', fontWeight: '900', color: '#111827', margin: '0 0 0.5rem' }}>
            {isRTL ? 'تسجيل الدخول إلى حسابك' : 'Sign In to Your Account'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#6b7280', margin: 0 }}>
            {isRTL ? 'تسوق بأمان وسهولة مع أعلى معايير الحماية' : 'Secure e-commerce portal with bank-grade safety'}
          </p>
        </div>

        {/* Location state message if redirected from protected cart */}
        {location.state?.message && !error && !lockState && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
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

        {/* Security Lockout / Failed Attempts Alert */}
        {lockState?.isLocked ? (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1.5px solid #ef4444',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem'
            }}>
              <ShieldAlert size={26} />
            </div>
            <h4 style={{ margin: '0 0 0.35rem', color: '#991b1b', fontWeight: '800', fontSize: '0.98rem' }}>
              {isRTL ? 'تم حظر الحساب لأسباب أمنية' : 'Account Blocked for Security'}
            </h4>
            <p style={{ margin: 0, color: '#b91c1c', fontSize: '0.85rem', lineHeight: '1.5' }}>
              {isRTL
                ? 'تم قفل هذا الحساب تلقائياً بسبب تسجيل 6 محاولات دخول خاطئة متتالية. يرجى التواصل مع إدارة المتجر لإلغاء القفل.'
                : 'This account has been automatically blocked after 6 consecutive invalid login attempts. Please contact store administration to unblock.'}
            </p>
          </div>
        ) : lockState?.attemptsRemaining !== undefined && lockState.attemptsRemaining > 0 ? (
          <div style={{
            backgroundColor: '#fffbeb',
            border: '1.5px solid #f59e0b',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem'
          }}>
            <AlertCircle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: '800', color: '#92400e', fontSize: '0.86rem' }}>
                {isRTL ? `محاولة خاطئة (${lockState.attempts} من 6)` : `Invalid Attempt (${lockState.attempts} of 6)`}
              </div>
              <div style={{ color: '#b45309', fontSize: '0.8rem', marginTop: '2px', lineHeight: '1.4' }}>
                {isRTL
                  ? `متبقي ${lockState.attemptsRemaining} محاولات قبل حظر الحساب نهائياً.`
                  : `Account will be blocked after ${lockState.attemptsRemaining} more failed attempts.`}
              </div>
            </div>
          </div>
        ) : error ? (
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
        ) : null}

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
            onClick={() => { setActiveTab('customer'); setEmail(''); setPassword(''); setError(''); setLockState(null); }}
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
            {isRTL ? 'حساب العميل' : 'Customer Account'}
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setEmail('admin@shop.com'); setPassword(''); setError(''); setLockState(null); }}
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
            {isRTL ? 'بوابة الإدارة' : 'Admin Portal'}
          </button>
        </div>

        {/* Quick autofill helper pills */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.25rem',
          justifyContent: 'center'
        }}>
          <button
            type="button"
            onClick={() => autofillCredentials('customer')}
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '20px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              color: '#475569',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <User size={12} />
            <span>{isRTL ? 'تعبئة بيانات العميل' : 'Customer: customer@shop.com'}</span>
          </button>
          <button
            type="button"
            onClick={() => autofillCredentials('admin')}
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '20px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              color: '#475569',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <ShieldCheck size={12} />
            <span>{isRTL ? 'تعبئة بيانات المسؤول' : 'Admin: admin@shop.com'}</span>
          </button>
        </div>

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
                required
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
                required
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
            disabled={loading || lockState?.isLocked}
            style={{
              marginTop: '0.5rem',
              backgroundColor: lockState?.isLocked ? '#9ca3af' : '#800020',
              color: '#ffffff',
              border: 'none',
              padding: '0.85rem',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: '800',
              cursor: (loading || lockState?.isLocked) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: lockState?.isLocked ? 'none' : '0 4px 12px rgba(128, 0, 32, 0.25)',
              opacity: loading ? 0.7 : 1
            }}
          >
            <span>
              {loading
                ? (isRTL ? 'جارٍ التحقق...' : 'Verifying...')
                : lockState?.isLocked
                ? (isRTL ? 'الحساب مقفل' : 'Account Blocked')
                : (isRTL ? 'تسجيل الدخول' : 'Sign In')}
            </span>
            <ArrowRight size={17} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
          </button>
        </form>

        {/* Footer info */}
        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.82rem', color: '#64748b' }}>
          <span>{isRTL ? 'ليس لديك حساب بعد؟ ' : "Don't have an account? "}</span>
          <Link to="/register" style={{ color: '#800020', fontWeight: '800', textDecoration: 'none' }}>
            {isRTL ? 'إنشاء حساب جديد' : 'Register Here'}
          </Link>
        </div>

      </div>
    </div>
  );
}
