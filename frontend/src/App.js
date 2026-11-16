import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import BottomNavBar from './components/BottomNavBar.js';
import HomePage from './pages/HomePage.js';
import UniformsPage from './pages/UniformsPage.js';
import ProductDetailPage from './pages/ProductDetailPage.js';
import CartPage from './pages/CartPage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import AdminDashboardPage from './pages/AdminDashboardPage.js';
import MyOrdersPage from './pages/MyOrdersPage.js';
import TrackOrderPage from './pages/TrackOrderPage.js';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { CartProvider } from './context/CartContext.js';

// Route Guard: Shopping Cart CANNOT be opened or viewed without login
function RequireAuthCart({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: 'Please log in to open your shopping cart.'
        }}
        replace
      />
    );
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Main Header */}
          <Header />

          {/* Router Content */}
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/uniforms" element={<UniformsPage />} />
              <Route path="/shop" element={<UniformsPage />} />
              <Route path="/product" element={<ProductDetailPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              {/* Cart cannot open without login */}
              <Route
                path="/cart"
                element={
                  <RequireAuthCart>
                    <CartPage />
                  </RequireAuthCart>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/my-orders" element={<MyOrdersPage />} />
              <Route path="/track-order" element={<TrackOrderPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          {/* Main Footer */}
          <Footer />

          {/* Native Mobile App Bottom Navigation Bar */}
          <BottomNavBar />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
