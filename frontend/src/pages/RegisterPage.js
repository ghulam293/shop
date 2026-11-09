import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, GraduationCap, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '+968 ',
    password: '',
    confirmPassword: '',
    studentName: '',
    grade: 'Grade 3',
    classSection: 'A'
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    const res = await register(formData);
    if (res.success) {
      navigate('/uniforms');
    } else {
      setError(res.message || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '520px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', padding: '2.5rem', border: '1px solid #e5e7eb' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <img
            src="/images/ips-logo.png"
            alt="IPS Logo"
            style={{ height: '58px', margin: '0 auto 0.75rem' }}
          />
          <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#800020', margin: 0 }}>
            {isRTL ? 'تسجيل حساب ولي أمر جديد' : 'Parent Registration'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '0.35rem' }}>
            IPS Oman School Uniforms & Supplies Portal
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Parent Details */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '0.3rem' }}>
              Parent / Guardian Full Name *
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Salim Al-Shanfari"
                style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.4rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '0.3rem' }}>
                Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="parent@example.com"
                  style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.4rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '0.3rem' }}>
                Phone Number (Oman) *
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+968 91234567"
                  style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.4rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '0.3rem' }}>
                Password (min 8 chars) *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.4rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '0.3rem' }}>
                Confirm Password *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.4rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>

          {/* Optional Student Association Card */}
          <div style={{ backgroundColor: '#fdf8f9', border: '1px solid #f7e4e8', borderRadius: '10px', padding: '1rem', marginTop: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#800020', fontWeight: '700', fontSize: '0.82rem', marginBottom: '0.65rem' }}>
              <GraduationCap size={16} />
              <span>Link Student for Size & Uniform Recommendations (Optional)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Student Name (e.g. Ahmed Al-Shanfari)"
                style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.82rem' }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem' }}>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  style={{ padding: '0.55rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.82rem', backgroundColor: '#fff' }}
                >
                  <option value="KG 1">KG 1</option>
                  <option value="KG 2">KG 2</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>

                <input
                  type="text"
                  name="classSection"
                  value={formData.classSection}
                  onChange={handleChange}
                  placeholder="Class (A)"
                  style={{ padding: '0.55rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.82rem' }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', fontSize: '0.95rem', marginTop: '0.5rem' }}
          >
            <span>{loading ? 'Registering Account...' : 'Create Parent Account'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #f3f4f6', fontSize: '0.84rem', color: '#4b5563' }}>
          <span>Already registered? </span>
          <Link to="/login" style={{ color: '#800020', fontWeight: '700' }}>
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}

