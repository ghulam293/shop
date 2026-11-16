import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';
import { addRegisteredCustomer } from '../services/customerStore.js';

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

    if (!cleanEmail || !cleanPassword) {
      setLoading(false);
      return {
        success: false,
        message: 'Please provide both email and password.'
      };
    }

    // 1. Attempt Live Backend API Authentication
    try {
      const response = await api.post('/auth/login', {
        email: cleanEmail,
        password: cleanPassword
      });

      if (response.data && response.data.success) {
        const userData = response.data.user;
        const authToken = response.data.token;
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('ips_user', JSON.stringify(userData));
        localStorage.setItem('ips_token', authToken);

        // Clear local failed attempts
        try {
          const attemptsMap = JSON.parse(localStorage.getItem('shop_failed_attempts') || '{}');
          delete attemptsMap[cleanEmail];
          localStorage.setItem('shop_failed_attempts', JSON.stringify(attemptsMap));
        } catch (_) {}

        setLoading(false);
        return { success: true, user: userData };
      }
    } catch (apiError) {
      if (apiError.response && apiError.response.data) {
        setLoading(false);
        return {
          success: false,
          code: apiError.response.data.code,
          isLocked: apiError.response.data.isLocked || apiError.response.status === 423,
          attempts: apiError.response.data.attempts,
          attemptsRemaining: apiError.response.data.attemptsRemaining,
          message: apiError.response.data.message || 'Login failed.'
        };
      }
    }

    // 2. Resilient Client-Side Lockout Security Enforcement (for offline or standalone Vercel preview)
    try {
      const attemptsMap = JSON.parse(localStorage.getItem('shop_failed_attempts') || '{}');
      const record = attemptsMap[cleanEmail] || { count: 0, isLocked: false };

      if (record.isLocked || record.count >= 6) {
        setLoading(false);
        return {
          success: false,
          code: 'ACCOUNT_LOCKED',
          isLocked: true,
          attempts: record.count,
          attemptsRemaining: 0,
          message: 'Security Alert: This account is blocked due to 6 invalid login attempts. Please contact store administration to unblock.'
        };
      }

      const isAdminUser = cleanEmail === 'admin@shop.com' || cleanEmail === 'admin';
      const isValidPass = isAdminUser
        ? (cleanPassword === 'admin123' || cleanPassword === 'admin')
        : (cleanPassword === 'password123' || cleanPassword === 'customer123');

      if (isValidPass) {
        delete attemptsMap[cleanEmail];
        localStorage.setItem('shop_failed_attempts', JSON.stringify(attemptsMap));

        const authUser = isAdminUser
          ? {
              id: 1,
              fullName: 'Store Administrator',
              email: 'admin@shop.com',
              phoneNumber: '+968 23 234567',
              roles: ['ADMIN']
            }
          : {
              id: 2,
              fullName: cleanEmail.includes('@') ? cleanEmail.split('@')[0].toUpperCase() : 'Customer',
              email: cleanEmail,
              phoneNumber: '+968 91 234567',
              roles: ['CUSTOMER']
            };

        const mockToken = 'shop-token-' + Date.now();
        setUser(authUser);
        setToken(mockToken);
        localStorage.setItem('ips_user', JSON.stringify(authUser));
        localStorage.setItem('ips_token', mockToken);
        setLoading(false);
        return { success: true, user: authUser };
      } else {
        record.count = (record.count || 0) + 1;
        if (record.count >= 6) {
          record.isLocked = true;
          attemptsMap[cleanEmail] = record;
          localStorage.setItem('shop_failed_attempts', JSON.stringify(attemptsMap));
          setLoading(false);
          return {
            success: false,
            code: 'ACCOUNT_LOCKED',
            isLocked: true,
            attempts: record.count,
            attemptsRemaining: 0,
            message: 'Security Alert: Account has been blocked after 6 invalid login attempts. Please contact store administration.'
          };
        } else {
          attemptsMap[cleanEmail] = record;
          localStorage.setItem('shop_failed_attempts', JSON.stringify(attemptsMap));
          const remaining = 6 - record.count;
          setLoading(false);
          return {
            success: false,
            code: 'INVALID_CREDENTIALS',
            isLocked: false,
            attempts: record.count,
            attemptsRemaining: remaining,
            message: `Invalid password. Attempt ${record.count} of 6. Account will be blocked after 6 invalid attempts.`
          };
        }
      }
    } catch (localErr) {
      setLoading(false);
      return { success: false, message: 'An unexpected error occurred during authentication.' };
    }
  };

  const register = async (formData) => {
    setLoading(true);
    const cleanEmail = (formData.email || '').trim().toLowerCase();
    
    // Attempt Backend Register
    try {
      const response = await api.post('/auth/register', {
        fullName: formData.fullName,
        email: cleanEmail,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword || formData.password
      });

      if (response.data && response.data.success) {
        const newUser = response.data.user;
        const authToken = response.data.token;
        setUser(newUser);
        setToken(authToken);
        localStorage.setItem('ips_user', JSON.stringify(newUser));
        localStorage.setItem('ips_token', authToken);

        // Add to customer accounts directory
        addRegisteredCustomer({
          id: newUser.id,
          name: newUser.fullName,
          email: newUser.email,
          phone: newUser.phoneNumber,
          status: 'Active'
        });

        setLoading(false);
        return { success: true, user: newUser };
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setLoading(false);
        return { success: false, message: err.response.data.message || 'Registration failed.' };
      }
    }

    // Fallback registration
    const newUser = {
      id: Date.now(),
      fullName: formData.fullName || 'Customer',
      email: cleanEmail,
      phoneNumber: formData.phoneNumber || '+968 90 000000',
      roles: ['CUSTOMER']
    };
    const mockToken = 'mock-user-token-' + Date.now();
    setUser(newUser);
    setToken(mockToken);
    localStorage.setItem('ips_user', JSON.stringify(newUser));
    localStorage.setItem('ips_token', mockToken);

    // Add to customer accounts directory
    addRegisteredCustomer({
      id: newUser.id,
      name: newUser.fullName,
      email: newUser.email,
      phone: newUser.phoneNumber,
      status: 'Active'
    });

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
