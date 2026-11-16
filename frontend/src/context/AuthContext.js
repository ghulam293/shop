import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ips_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (_) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('ips_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for custom logout event from api interceptor
    const handleLogoutEvent = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('ips-auth-logout', handleLogoutEvent);
    return () => window.removeEventListener('ips-auth-logout', handleLogoutEvent);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // 1. Instant check for Admin login
    const isAdminUser =
      cleanEmail === 'admin@shop.com' ||
      cleanEmail === 'admin@ipsoman.com' ||
      cleanEmail.startsWith('admin@') ||
      cleanEmail === 'admin';

    if (isAdminUser) {
      const adminData = {
        id: 1,
        fullName: 'Store Administrator',
        email: 'admin@shop.com',
        phoneNumber: '+968 23 234567',
        roles: ['ADMIN']
      };
      const mockToken = 'mock-admin-token-' + Date.now();
      setUser(adminData);
      setToken(mockToken);
      localStorage.setItem('ips_user', JSON.stringify(adminData));
      localStorage.setItem('ips_token', mockToken);
      setLoading(false);
      return { success: true, user: adminData };
    }

    // 2. Check Customer / Demo user login
    if (cleanEmail) {
      const customerData = {
        id: 2,
        fullName: cleanEmail === 'demo@shop.com' || cleanEmail === 'customer@shop.com'
          ? 'Salim Al-Shanfari'
          : cleanEmail.split('@')[0].replace(/[._-]/g, ' ').toUpperCase(),
        email: cleanEmail,
        phoneNumber: '+968 91 234567',
        roles: ['CUSTOMER']
      };
      const mockToken = 'mock-customer-token-' + Date.now();
      setUser(customerData);
      setToken(mockToken);
      localStorage.setItem('ips_user', JSON.stringify(customerData));
      localStorage.setItem('ips_token', mockToken);
      setLoading(false);
      return { success: true, user: customerData };
    }

    // Fallback if empty
    setLoading(false);
    return {
      success: false,
      message: 'Please provide a valid email and password.'
    };
  };

  const register = async (formData) => {
    setLoading(true);
    const newUser = {
      id: Date.now(),
      fullName: formData.fullName || 'New Customer',
      email: formData.email.toLowerCase(),
      phoneNumber: formData.phoneNumber || '+968 90 000000',
      roles: ['CUSTOMER']
    };
    const mockToken = 'mock-user-token-' + Date.now();
    setUser(newUser);
    setToken(mockToken);
    localStorage.setItem('ips_user', JSON.stringify(newUser));
    localStorage.setItem('ips_token', mockToken);
    setLoading(false);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ips_user');
    localStorage.removeItem('ips_token');
  };

  const isAuthenticated = !!user;
  const isAdmin = user && Array.isArray(user.roles) && user.roles.includes('ADMIN');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
