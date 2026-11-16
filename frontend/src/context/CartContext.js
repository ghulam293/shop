import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext.js';

const CartContext = createContext();

// Seed initial demo customer carts so Admin can view them out-of-the-box
function initDemoAdminCarts() {
  try {
    const existing = localStorage.getItem('shop_all_customer_carts');
    if (!existing) {
      const initialCarts = {
        '2': {
          userId: 2,
          customerName: 'Salim Al-Shanfari',
          customerEmail: 'demo@shop.com',
          customerPhone: '+968 91 234567',
          itemCount: 2,
          subtotal: '14.500',
          updatedAt: '10:45 AM',
          items: [
            {
              id: 'item-demo-1',
              productId: 1,
              nameEn: 'Official Polo Shirt (Maroon)',
              nameAr: 'قميص بولو مدرسي رسمي (عنابي)',
              sku: 'UNIF-POLO-MRN',
              size: 'M',
              price: 6.000,
              quantity: 1,
              image: '/products/polo-shirt-front.jpg'
            },
            {
              id: 'item-demo-2',
              productId: 2,
              nameEn: "Boys' Formal Trousers (Gray)",
              nameAr: 'بنطال رمادي رسمي للأولاد',
              sku: 'UNIF-TRSR-GRY',
              size: '30',
              price: 8.500,
              quantity: 1,
              image: '/products/boys-gray-trousers.jpg'
            }
          ]
        },
        '3': {
          userId: 3,
          customerName: 'Fatima Al-Kathiri',
          customerEmail: 'fatima.kathiri@gmail.com',
          customerPhone: '+968 92 345678',
          itemCount: 1,
          subtotal: '7.500',
          updatedAt: '09:20 AM',
          items: [
            {
              id: 'item-demo-3',
              productId: 11,
              nameEn: 'Cambridge Primary Science Textbook',
              nameAr: 'كتاب كامبريدج للعلوم العامة والاكتشاف',
              sku: 'BOOK-SCI-P1',
              size: 'Stage 4',
              price: 7.500,
              quantity: 1,
              image: '/products/cambridge-science-book.jpg'
            }
          ]
        }
      };
      localStorage.setItem('shop_all_customer_carts', JSON.stringify(initialCarts));
    }
  } catch (_) {
    // Ignore storage errors
  }
}

initDemoAdminCarts();

export function CartProvider({ children }) {
  const { user, isAuthenticated, isAdmin } = useAuth();

  // Helper for per-user storage key (Strict User Isolation)
  const getUserCartKey = useCallback((u) => {
    if (!u || !u.id) return null;
    return `shop_cart_user_${u.id}`;
  }, []);

  // Items for the CURRENT logged-in user only
  const [items, setItems] = useState(() => {
    if (!isAuthenticated || !user) return [];
    try {
      const key = `shop_cart_user_${user.id}`;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  // Private toast notification on item add (shown ONLY to the person who added it)
  const [cartAlert, setCartAlert] = useState(null);

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('shop_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  // Switch cart when user logs in, logs out, or switches accounts
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setItems([]);
      return;
    }

    try {
      const key = getUserCartKey(user);
      const saved = localStorage.getItem(key);
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        // Check if demo user has an existing cart in admin registry
        const registry = JSON.parse(localStorage.getItem('shop_all_customer_carts') || '{}');
        if (registry[user.id] && registry[user.id].items) {
          setItems(registry[user.id].items);
          localStorage.setItem(key, JSON.stringify(registry[user.id].items));
        } else {
          setItems([]);
        }
      }
    } catch (e) {
      console.warn('Error loading user cart:', e);
      setItems([]);
    }
  }, [user, isAuthenticated, getUserCartKey]);

  // Persist items for the current user & sync to Admin active carts registry
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    try {
      const key = getUserCartKey(user);
      if (key) {
        localStorage.setItem(key, JSON.stringify(items));
      }

      // Sync to Admin Carts Registry so ONLY Admin can view every person's active cart
      const registry = JSON.parse(localStorage.getItem('shop_all_customer_carts') || '{}');
      if (items.length > 0) {
        const sub = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
        registry[user.id] = {
          userId: user.id,
          customerName: user.fullName || user.email?.split('@')[0] || 'Customer',
          customerEmail: user.email || 'customer@shop.com',
          customerPhone: user.phoneNumber || '',
          itemCount: items.reduce((acc, curr) => acc + curr.quantity, 0),
          subtotal: sub.toFixed(3),
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          items: items
        };
      } else {
        delete registry[user.id];
      }
      localStorage.setItem('shop_all_customer_carts', JSON.stringify(registry));
    } catch (e) {
      console.warn('Error saving user cart:', e);
    }
  }, [items, user, isAuthenticated, getUserCartKey]);

  useEffect(() => {
    try {
      localStorage.setItem('shop_wishlist', JSON.stringify(wishlist));
    } catch (_) {}
  }, [wishlist]);

  // Add to cart: triggers private toast notification ONLY for the current person
  const addToCart = (product, selectedSize = 'M', quantity = 1) => {
    const qty = parseInt(quantity, 10) || 1;
    const price = parseFloat(product.base_price || product.price || 6.500);

    setItems((prevItems) => {
      const existingIdx = prevItems.findIndex(
        (item) => item.productId === product.id && item.size === selectedSize
      );

      let updated;
      if (existingIdx > -1) {
        updated = [...prevItems];
        updated[existingIdx].quantity += qty;
      } else {
        updated = [
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
            quantity: qty
          }
        ];
      }
      return updated;
    });

    // Private Notification: Visible only to the current person who added the item
    const itemName = product.name_en || product.nameEn || 'Item';
    setCartAlert({
      show: true,
      productName: itemName,
      size: selectedSize,
      quantity: qty
    });

    setTimeout(() => {
      setCartAlert(null);
    }, 3200);
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

  // Function exclusively for Admin to view every customer's active cart
  const getAllCustomerCarts = useCallback(() => {
    try {
      const registry = JSON.parse(localStorage.getItem('shop_all_customer_carts') || '{}');
      return Object.values(registry);
    } catch (_) {
      return [];
    }
  }, []);

  // Calculations for current user only
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 0.000;
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
        cartAlert,
        setCartAlert,
        getAllCustomerCarts,
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


