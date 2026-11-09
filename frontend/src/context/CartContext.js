import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from './AuthContext.js';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ips_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('ips_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('ips_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('ips_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product, selectedSize = 'M', quantity = 1, studentId = null) => {
    const qty = parseInt(quantity, 10) || 1;
    const price = parseFloat(product.base_price || product.price || 6.500);

    setItems((prevItems) => {
      const existingIdx = prevItems.findIndex(
        (item) => item.productId === product.id && item.size === selectedSize
      );

      if (existingIdx > -1) {
        const updated = [...prevItems];
        updated[existingIdx].quantity += qty;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            productId: product.id,
            nameEn: product.name_en || product.nameEn,
            nameAr: product.name_ar || product.nameAr,
            sku: product.sku,
            size: selectedSize,
            price: price,
            image: product.primary_image || product.image || (product.images && product.images[0]?.image_url) || '/products/polo-shirt-front.jpg',
            quantity: qty,
            studentId
          }
        ];
      }
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: qty } : item))
    );
  };

  const removeFromCart = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Calculations
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 0.000; // Standard free campus pickup
  const total = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal: subtotal.toFixed(3),
        shippingFee: shippingFee.toFixed(3),
        total: total.toFixed(3),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

