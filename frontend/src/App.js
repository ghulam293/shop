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

// Route Guard: Protected routes requiring user authentication
function RequireAuth({ children, message = 'Please log in to continue.' }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message
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
              {/* Protected Routes: Cart, Orders, Tracking strictly require login */}
              <Route
                path="/cart"
                element={
                  <RequireAuth message="Please log in to open your shopping cart.">
                    <CartPage />
                  </RequireAuth>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route
                path="/my-orders"
                element={
                  <RequireAuth message="Please log in to view your orders.">
                    <MyOrdersPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/track-order"
                element={
                  <RequireAuth message="Please log in to track your orders.">
                    <TrackOrderPage />
                  </RequireAuth>
                }
              />
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
