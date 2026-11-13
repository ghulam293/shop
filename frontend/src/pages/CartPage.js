import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Package,
  Lock,
  CreditCard,
  Banknote,
  MapPin,
  Calendar,
  User,
  Phone
} from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';

export default function CartPage() {
  const { items, itemCount, subtotal, shippingFee, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated, user, login } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [orderPlaced, setOrderPlaced] = useState(null);
  
  // Payment Method: 'DEBIT_CARD' or 'CASH_ON_DELIVERY'
  const [paymentMethod, setPaymentMethod] = useState('DEBIT_CARD');
  
  // Card Details State
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Cash on Delivery Details
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2, 4)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const fillDemoCard = () => {
    setCardNumber('4111 2222 3333 4444');
    setCardHolder('Ahmed Al-Balushi');
    setCardExpiry('12/28');
    setCardCvv('123');
  };

  const fillDemoCOD = () => {
    setDeliveryPhone('+968 9123 4567');
    setDeliveryAddress('Salalah, Sultan Qaboos Street');
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: { pathname: '/cart' },
          message: isRTL
            ? 'يرجى تسجيل الدخول أولاً لإتمام عملية الشراء والدفع.'
            : 'Please log in to complete your checkout and payment.'
        }
      });
      return;
    }

    // Validation
    if (paymentMethod === 'DEBIT_CARD') {
      const cleanCard = cardNumber.replace(/\s/g, '');
      if (cleanCard.length < 15) {
        setErrorMessage(isRTL ? 'يرجى إدخال رقم بطاقة صالح مكون من 16 رقماً.' : 'Please enter a valid 16-digit debit/credit card number.');
        return;
      }
      if (!cardHolder.trim()) {
        setErrorMessage(isRTL ? 'يرجى كتابة اسم حامل البطاقة.' : 'Please enter the cardholder name.');
        return;
      }
      if (cardExpiry.length < 5) {
        setErrorMessage(isRTL ? 'يرجى إدخال تاريخ انتهاء البطاقة (MM/YY).' : 'Please enter a valid expiry date (MM/YY).');
        return;
      }
      if (cardCvv.length < 3) {
        setErrorMessage(isRTL ? 'يرجى إدخال رمز الأمان CVV.' : 'Please enter a valid 3 or 4-digit CVV code.');
        return;
      }
    } else if (paymentMethod === 'CASH_ON_DELIVERY') {
      if (!deliveryPhone.trim()) {
        setErrorMessage(isRTL ? 'يرجى إدخال رقم الهاتف للتواصل والتسليم.' : 'Please enter your phone number for delivery contact.');
        return;
      }
    }

    setIsProcessing(true);

    setTimeout(() => {
      const orderNumber = `ORD-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const cleanCard = cardNumber.replace(/\s/g, '');
      
      const newOrder = {
        orderNumber,
        items: [...items],
        total,
        subtotal,
        paymentMethod: paymentMethod === 'DEBIT_CARD' ? 'Debit Card' : 'Cash on Delivery',
        paymentMethodCode: paymentMethod,
        paymentDetails: paymentMethod === 'DEBIT_CARD'
          ? `Debit Card ending in •••• ${cleanCard.slice(-4)}`
          : `Cash on Delivery (Pay upon arrival)`,
        paymentStatus: paymentMethod === 'DEBIT_CARD' ? 'PAID' : 'PENDING_CASH',
        customerPhone: deliveryPhone || user?.phone || 'Provided at checkout',
        customerAddress: deliveryAddress || 'Standard School Delivery',
        date: new Date().toLocaleDateString('en-GB')
      };

      // Save to localStorage for MyOrdersPage
      try {
        const existing = JSON.parse(localStorage.getItem('ips_orders') || '[]');
        localStorage.setItem('ips_orders', JSON.stringify([newOrder, ...existing]));
      } catch (err) {
        console.warn('Could not save to ips_orders', err);
      }

      setIsProcessing(false);
      setOrderPlaced(newOrder);
      clearCart();
    }, 900);
  };

  if (orderPlaced) {
    return (
      <div style={{ maxWidth: '640px', margin: '3.5rem auto', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          width: '74px',
          height: '74px',
          backgroundColor: '#dcfce7',
          color: '#16a34a',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 4px 14px rgba(22, 163, 74, 0.2)'
        }}>
          <CheckCircle size={44} />
        </div>

        <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#800020', marginBottom: '0.5rem' }}>
          {isRTL ? 'تم تأكيد طلبكم بنجاح!' : 'Order Placed Successfully!'}
        </h2>
        
        <p style={{ fontSize: '0.98rem', color: '#4b5563', marginBottom: '1.5rem' }}>
          {isRTL ? 'رقم مرجع الطلب:' : 'Order Reference:'}{' '}
          <strong style={{ color: '#111827', fontSize: '1.05rem' }}>#{orderPlaced.orderNumber}</strong>
        </p>

        {/* Receipt Box */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: isRTL ? 'right' : 'left',
          marginBottom: '2rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>{isRTL ? 'طريقة الدفع:' : 'Payment Method:'}</span>
            <span style={{ fontWeight: '700', color: '#111827', fontSize: '0.9rem' }}>
              {orderPlaced.paymentMethod}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>{isRTL ? 'تفاصيل السداد:' : 'Payment Status:'}</span>
            <span style={{
              fontWeight: '700',
              color: orderPlaced.paymentStatus === 'PAID' ? '#15803d' : '#b45309',
              backgroundColor: orderPlaced.paymentStatus === 'PAID' ? '#dcfce7' : '#fef3c7',
              padding: '0.2rem 0.6rem',
              borderRadius: '6px',
              fontSize: '0.8rem'
            }}>
              {orderPlaced.paymentStatus === 'PAID'
                ? (isRTL ? 'تم الدفع بالبطاقة البنكية' : 'Paid via Debit Card')
                : (isRTL ? 'الدفع نقداً عند الاستلام' : 'Cash on Delivery')}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>{isRTL ? 'تاريخ الطلب:' : 'Order Date:'}</span>
            <span style={{ color: '#374151', fontSize: '0.85rem' }}>{orderPlaced.date}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#800020' }}>{isRTL ? 'إجمالي المبلغ:' : 'Total Amount:'}</span>
            <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#800020' }}>OMR {orderPlaced.total}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/my-orders"
            style={{
              padding: '0.8rem 1.6rem',
              backgroundColor: '#800020',
              color: '#ffffff',
              borderRadius: '8px',
              fontWeight: '700',
              textDecoration: 'none'
            }}
          >
            {isRTL ? 'عرض طلباتي' : 'View My Orders'}
          </Link>
          <Link
            to="/uniforms"
            style={{
              padding: '0.8rem 1.6rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              borderRadius: '8px',
              fontWeight: '700',
              textDecoration: 'none'
            }}
          >
            {isRTL ? 'متابعة التسوق' : 'Continue Shopping'}
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '5rem auto', padding: '2rem', textAlign: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#fdf2f4',
          color: '#800020',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <ShoppingCart size={40} />
        </div>
        <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>
          {isRTL ? 'سلة التسوق فارغة' : 'Your Shopping Cart is Empty'}
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#6b7280', marginBottom: '2rem' }}>
          {isRTL
            ? 'تصفح تشكيلة الزي المدرسي والكتب والمستلزمات وأضف المقاسات المطلوبة إلى سلتك.'
            : 'Browse the store collection, choose your items and sizes to get started.'}
        </p>
        <Link
          to="/uniforms"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.85rem',
            backgroundColor: '#800020',
            color: '#ffffff',
            borderRadius: '8px',
            fontWeight: '700',
            textDecoration: 'none'
          }}
        >
          <Package size={18} />
          <span>{isRTL ? 'تصفح المنتجات' : 'Browse Products'}</span>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1.25rem 4rem' }}>
      <h1 style={{
        fontSize: '1.8rem',
        fontWeight: '900',
        color: '#800020',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem'
      }}>
        <ShoppingCart size={28} />
        <span>{t('cart')} ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                gap: '1.25rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '1.25rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              <img
                src={item.image}
                alt={item.nameEn}
                style={{
                  width: '90px',
                  height: '90px',
                  objectFit: 'contain',
                  backgroundColor: '#fbf9fa',
                  borderRadius: '8px',
                  padding: '0.35rem'
                }}
              />

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                  {isRTL ? item.nameAr : item.nameEn}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '3px 0 10px' }}>
                  SKU: {item.sku || 'ITEM'} • Size: <strong style={{ color: '#800020' }}>{item.size}</strong>
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  {/* Quantity Stepper */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{ padding: '0.35rem 0.75rem', backgroundColor: '#f3f4f6', cursor: 'pointer', border: 'none', fontWeight: 'bold' }}
                    >
                      -
                    </button>
                    <span style={{ padding: '0.35rem 0.95rem', fontSize: '0.88rem', fontWeight: '700' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ padding: '0.35rem 0.75rem', backgroundColor: '#f3f4f6', cursor: 'pointer', border: 'none', fontWeight: 'bold' }}
                    >
                      +
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#800020' }}>
                      OMR {(item.price * item.quantity).toFixed(3)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                      style={{ color: '#9ca3af', border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Checkout & Payment Selector */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          padding: '1.5rem',
          boxShadow: '0 4px 14px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: '800',
            color: '#111827',
            margin: '0 0 1.25rem',
            borderBottom: '1px solid #f3f4f6',
            paddingBottom: '0.75rem'
          }}>
            {isRTL ? 'ملخص الطلب وطريقة الدفع' : 'Order & Payment'}
          </h2>

          {/* Pricing Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
              <span>{isRTL ? 'إجمالي المنتجات:' : 'Subtotal:'}</span>
              <span style={{ fontWeight: '600' }}>OMR {subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
              <span>{isRTL ? 'رسوم التوصيل:' : 'Delivery Fee:'}</span>
              <span style={{ color: '#16a34a', fontWeight: '700' }}>FREE</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.2rem',
              fontWeight: '900',
              color: '#800020',
              borderTop: '2px dashed #e5e7eb',
              paddingTop: '0.85rem'
            }}>
              <span>{isRTL ? 'المبلغ النهائي:' : 'Total Amount:'}</span>
              <span>OMR {total}</span>
            </div>
          </div>

          {/* Login Required Notice if not logged in */}
          {!isAuthenticated && (
            <div style={{
              backgroundColor: '#fffbeb',
              border: '1.5px solid #fde68a',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#92400e', fontWeight: '800', fontSize: '0.9rem' }}>
                <Lock size={18} color="#b45309" />
                <span>{isRTL ? 'تسجيل الدخول مطلوب لإتمام الشراء' : 'Login Required to Complete Purchase'}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#78350f', lineHeight: '1.4' }}>
                {isRTL
                  ? 'يجب تسجيل الدخول قبل إتمام الطلب والدفع. يمكنك تسجيل الدخول بنقرة واحدة كعميل تجريبي والمتابعة فوراً:'
                  : 'You must be logged in before placing your order. You can use 1-click instant login below to proceed immediately:'}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                <button
                  type="button"
                  onClick={() => login('demo@shop.com', 'customer123')}
                  style={{
                    backgroundColor: '#800020',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  ⚡ {isRTL ? 'دخول فوري كعميل تجريبي' : '1-Click Customer Demo Login'}
                </button>
                <Link
                  to="/login"
                  state={{ from: { pathname: '/cart' } }}
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#800020',
                    border: '1px solid #800020',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    textDecoration: 'none'
                  }}
                >
                  {isRTL ? 'صفحة تسجيل الدخول' : 'Go to Login Page'}
                </Link>
              </div>
            </div>
          )}

          {/* PAYMENT METHOD SELECTION (DEBIT CARD & CASH ON DELIVERY ONLY) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.86rem',
              fontWeight: '800',
              color: '#1f2937',
              marginBottom: '0.75rem'
            }}>
              {isRTL ? 'اختر طريقة الدفع:' : 'Select Payment Method:'}
            </label>

            {/* Option 1: Debit / Credit Card */}
            <div
              onClick={() => setPaymentMethod('DEBIT_CARD')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                border: paymentMethod === 'DEBIT_CARD' ? '2px solid #800020' : '1px solid #d1d5db',
                borderRadius: '10px',
                backgroundColor: paymentMethod === 'DEBIT_CARD' ? '#fdf8f9' : '#ffffff',
                cursor: 'pointer',
                marginBottom: '0.75rem',
                transition: 'all 0.15s ease'
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="DEBIT_CARD"
                checked={paymentMethod === 'DEBIT_CARD'}
                onChange={() => setPaymentMethod('DEBIT_CARD')}
                style={{ accentColor: '#800020' }}
              />
              <CreditCard size={22} color={paymentMethod === 'DEBIT_CARD' ? '#800020' : '#4b5563'} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#111827' }}>
                  {isRTL ? 'بطاقة بنكية (خصم / ائتمان)' : 'Debit / Credit Card'}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#6b7280' }}>
                  {isRTL ? 'دفع إلكتروني آمن وفوري' : 'Visa, Mastercard, OmanNet'}
                </div>
              </div>
            </div>

            {/* Option 2: Cash on Delivery */}
            <div
              onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                border: paymentMethod === 'CASH_ON_DELIVERY' ? '2px solid #800020' : '1px solid #d1d5db',
                borderRadius: '10px',
                backgroundColor: paymentMethod === 'CASH_ON_DELIVERY' ? '#fdf8f9' : '#ffffff',
                cursor: 'pointer',
                marginBottom: '1rem',
                transition: 'all 0.15s ease'
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="CASH_ON_DELIVERY"
                checked={paymentMethod === 'CASH_ON_DELIVERY'}
                onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                style={{ accentColor: '#800020' }}
              />
              <Banknote size={22} color={paymentMethod === 'CASH_ON_DELIVERY' ? '#800020' : '#4b5563'} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#111827' }}>
                  {isRTL ? 'الدفع نقداً عند الاستلام' : 'Cash on Delivery (COD)'}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#6b7280' }}>
                  {isRTL ? 'ادفع نقداً عند استلام طلبك' : 'Pay in cash upon receiving order'}
                </div>
              </div>
            </div>

            {/* Interactive Card Form when Debit Card selected */}
            {paymentMethod === 'DEBIT_CARD' && (
              <div style={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#800020' }}>
                    {isRTL ? 'بيانات البطاقة' : 'Card Details'}
                  </span>
                  <button
                    type="button"
                    onClick={fillDemoCard}
                    style={{
                      background: 'none',
                      border: '1px solid #800020',
                      color: '#800020',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {isRTL ? 'تعبئة بطاقة تجريبية' : 'Fill Demo Card'}
                  </button>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>
                    {isRTL ? 'رقم البطاقة البنكية:' : 'Card Number:'}
                  </label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>
                    {isRTL ? 'اسم حامل البطاقة:' : 'Cardholder Name:'}
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name as on Card"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>
                      {isRTL ? 'تاريخ الانتهاء:' : 'Expiry (MM/YY):'}
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '0.88rem',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>
                      CVV:
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Delivery Phone when Cash on Delivery selected */}
            {paymentMethod === 'CASH_ON_DELIVERY' && (
              <div style={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#800020' }}>
                    {isRTL ? 'بيانات التسليم والدفع نقداً' : 'Delivery Details (Cash)'}
                  </span>
                  <button
                    type="button"
                    onClick={fillDemoCOD}
                    style={{
                      background: 'none',
                      border: '1px solid #800020',
                      color: '#800020',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {isRTL ? 'تعبئة بيانات تجريبية' : 'Fill Demo Info'}
                  </button>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>
                    {isRTL ? 'رقم هاتف التواصل للتسليم:' : 'Contact Phone Number:'}
                  </label>
                  <input
                    type="tel"
                    placeholder="+968 9123 4567"
                    value={deliveryPhone}
                    onChange={(e) => setDeliveryPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>
                    {isRTL ? 'عنوان التسليم / ملاحظات:' : 'Delivery Address / Notes (Optional):'}
                  </label>
                  <input
                    type="text"
                    placeholder={isRTL ? 'المنطقة، الشارع أو الاستلام من المتجر' : 'City, Street or Store Pickup'}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Validation Error Message */}
          {errorMessage && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #f87171',
              color: '#b91c1c',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              marginBottom: '1rem'
            }}>
              {errorMessage}
            </div>
          )}

          {/* Checkout Submit Button */}
          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '800',
              backgroundColor: '#800020',
              color: '#ffffff',
              border: 'none',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(128, 0, 32, 0.25)',
              opacity: isProcessing ? 0.7 : 1
            }}
          >
            {isProcessing ? (
              <span>{isRTL ? 'جارٍ معالجة الطلب...' : 'Processing Order...'}</span>
            ) : isAuthenticated ? (
              <>
                <CreditCard size={18} />
                <span>
                  {paymentMethod === 'DEBIT_CARD'
                    ? (isRTL ? `دفع OMR ${total} بالبطاقة` : `Pay OMR ${total} via Debit Card`)
                    : (isRTL ? `تأكيد الطلب نقداً (OMR ${total})` : `Confirm Order with Cash (OMR ${total})`)}
                </span>
              </>
            ) : (
              <>
                <Lock size={18} />
                <span>{isRTL ? 'تسجيل الدخول لإتمام الشراء' : 'Login to Place Order'}</span>
              </>
            )}
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            marginTop: '1rem',
            color: '#6b7280',
            fontSize: '0.76rem',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={16} color="#16a34a" />
            <span>{isRTL ? 'دفع آمن ومحمي ومعتمد' : 'Secure & Certified Checkout'}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
