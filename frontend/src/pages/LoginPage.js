import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, ArrowRight, ShieldAlert, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      if (res.user.roles.includes('ADMIN')) {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(res.message || 'Invalid email or password.');
    }
  };

  const fillAdmin = () => {
    setEmail('admin@ipsoman.com');
    setPassword('Admin@IPS2026!');
    setError('');
  };

  const fillParent = () => {
    setEmail('parent@ipsoman.com');
    setPassword('Parent@2026!');
    setError('');
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', padding: '2.25rem', border: '1px solid #e5e7eb' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#800020',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            color: '#fff'
          }}>
            <ShoppingCart size={24} />
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: '900', color: '#800020', margin: 0 }}>
            {isRTL ? 'المتجر' : 'Shop'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.35rem' }}>
            {isRTL ? 'تسجيل الدخول إلى حسابك' : 'Sign in to your account'}
          </p>
        </div>

        {/* Message if redirected for requiring login */}
        {location.state?.message && (
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.75rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1.25rem', color: '#92400e', fontSize: '0.84rem' }}>
            <Lock size={16} style={{ color: '#b45309', flexShrink: 0 }} />
            <span>{location.state.message}</span>
          </div>
        )}

        {/* Quick Demo Credentials Helper */}
        <div style={{ backgroundColor: '#fdf2f4', border: '1px solid #f9dbe1', borderRadius: '10px', padding: '0.85rem', marginBottom: '1.5rem', fontSize: '0.78rem' }}>
          <div style={{ fontWeight: '700', color: '#800020', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
            <ShieldAlert size={14} />
            <span>Quick Login Credentials:</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={fillAdmin}
              style={{ backgroundColor: '#800020', color: '#fff', padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.74rem', fontWeight: '600', cursor: 'pointer' }}
            >
              Fill Admin Credentials
            </button>
            <button
              type="button"
              onClick={fillParent}
              style={{ backgroundColor: '#D4AF37', color: '#111', padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.74rem', fontWeight: '600', cursor: 'pointer' }}
            >
              Fill Demo Credentials
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '0.35rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.4rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#374151' }}>
                Password
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please contact IPS School IT Helpdesk or your student admin to reset password.'); }} style={{ fontSize: '0.75rem', color: '#800020' }}>
                Forgot?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.4rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', fontSize: '0.95rem', marginTop: '0.5rem' }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer Link to Register */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f3f4f6', fontSize: '0.84rem', color: '#4b5563' }}>
          <span>Don't have a parent account yet? </span>
          <Link to="/register" style={{ color: '#800020', fontWeight: '700' }}>
            Register Student Parent
          </Link>
        </div>

      </div>
    </div>
  );
}

