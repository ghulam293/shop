import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  Phone,
  CreditCard,
  Banknote,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Printer
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { useAuth } from '../context/AuthContext.js';

export default function TrackOrderPage() {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isRTL } = useLanguage();

  const [inputQuery, setInputQuery] = useState('');
  const [activeOrder, setActiveOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // Sample default trackable orders
  const sampleOrders = [
    {
      orderNumber: 'ORD-2026-92810',
      status: 'OUT_FOR_DELIVERY', // 'CONFIRMED' | 'PROCESSING' | 'OUT_FOR_DELIVERY' | 'DELIVERED'
      statusStep: 3,
      date: 'Today, 10:30 AM',
      estimatedDelivery: 'Today by 06:00 PM',
      courierName: 'Oman Express Courier',
      trackingCode: 'OMN-EXP-884912',
      customerName: 'Salim Al-Shanfari',
      customerPhone: '+968 9123 4567',
      customerAddress: 'Al-Haffa, Sultan Qaboos Street, Salalah',
      paymentMethod: 'Debit Card',
      paymentStatus: 'PAID',
      subtotal: 16.500,
      total: 16.500,
      items: [
        { id: 1, nameEn: 'Official Polo Shirt (Maroon)', nameAr: 'قميص بولو مدرسي رسمي (عنابي)', size: 'M', quantity: 2, price: 6.000, image: '/products/polo-shirt-front.jpg' },
        { id: 6, nameEn: 'Official Uniform Belt & Accessories', nameAr: 'حزام مدرسي جلدي وإكسسوارات', size: 'Standard', quantity: 1, price: 2.500, image: '/products/school-accessories-set.jpg' },
        { id: 7, nameEn: 'Cotton School Socks (White Pair)', nameAr: 'جوارب مدرسية بيضاء قطنية (زوج)', size: 'M (34-38)', quantity: 2, price: 1.000, image: '/products/school-socks-white.jpg' }
      ]
    },
    {
      orderNumber: 'ORD-2026-84192',
      status: 'PROCESSING',
      statusStep: 2,
      date: 'Today, 08:45 AM',
      estimatedDelivery: 'Tomorrow by 02:00 PM',
      courierName: 'Standard City Dispatch',
      trackingCode: 'OMN-STD-419201',
      customerName: 'Fatima Al-Kathiri',
      customerPhone: '+968 9234 5678',
      customerAddress: 'Al-Saada North, Near Park, Salalah',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'PENDING_CASH',
      subtotal: 14.500,
      total: 14.500,
      items: [
        { id: 12, nameEn: 'Ergonomic Spine-Support School Backpack', nameAr: 'حقيبة مدرسية طبية مريحة مع مقلمة', size: 'Senior (Grades 5-12)', quantity: 1, price: 14.500, image: '/products/school-bags-accessories.jpg' }
      ]
    },
    {
      orderNumber: 'ORD-2026-71049',
      status: 'DELIVERED',
      statusStep: 4,
      date: 'Yesterday, 03:15 PM',
      estimatedDelivery: 'Delivered Successfully',
      courierName: 'Oman Express Courier',
      trackingCode: 'OMN-EXP-710499',
      customerName: 'Mohammed Al-Rawas',
      customerPhone: '+968 9345 6789',
      customerAddress: 'Awqad, Salalah Center',
      paymentMethod: 'Debit Card',
      paymentStatus: 'PAID',
      subtotal: 21.500,
      total: 21.500,
      items: [
        { id: 8, nameEn: "Cambridge Primary English Learner's Book", nameAr: 'كتاب كامبريدج للغة الإنجليزية', size: 'Stage 3', quantity: 1, price: 7.500, image: '/products/cambridge-english-book.jpg' },
        { id: 13, nameEn: 'Thermal Bento Lunch Box & Water Bottle Set', nameAr: 'طقم حافظة طعام ومطارة ماء', size: 'Standard (750ml)', quantity: 1, price: 5.500, image: '/products/lunch-boxes-drinkware.jpg' },
        { id: 16, nameEn: 'Scientific Calculator & Fast Charging Tech Kit', nameAr: 'آلة حاسبة علمية وطقم شحن سريع', size: 'Exam Standard', quantity: 1, price: 8.500, image: '/products/electronics-mobile-accessories.jpg' }
      ]
    }
  ];

  // Look for order in localStorage or sampleOrders
  const findOrder = (query) => {
    if (!query || !query.trim()) return null;
    const clean = query.trim().toUpperCase();

    // 1. Check user local storage orders placed in this session
    try {
      const localOrders = JSON.parse(localStorage.getItem('ips_orders') || '[]');
      const foundLocal = localOrders.find(
        (o) =>
          o.orderNumber?.toUpperCase() === clean ||
          o.customerPhone?.replace(/\s/g, '').includes(clean.replace(/\s/g, ''))
      );
      if (foundLocal) {
        return {
          orderNumber: foundLocal.orderNumber,
          status: foundLocal.status || 'CONFIRMED',
          statusStep: foundLocal.status === 'COMPLETED' ? 4 : (foundLocal.status === 'PROCESSING' ? 2 : 1),
          date: foundLocal.date || 'Today',
          estimatedDelivery: 'Within 24-48 Hours',
          courierName: 'Oman Express Store Dispatch',
          trackingCode: `TRK-${foundLocal.orderNumber?.replace('ORD-', '')}`,
          customerName: foundLocal.customerName || 'Store Customer',
          customerPhone: foundLocal.customerPhone || '+968 9000 0000',
          customerAddress: foundLocal.customerAddress || 'Express Home Delivery, Oman',
          paymentMethod: foundLocal.paymentMethod || 'Debit Card',
          paymentStatus: foundLocal.paymentStatus || 'PAID',
          subtotal: foundLocal.subtotal || foundLocal.total || 0,
          total: foundLocal.total || 0,
          items: foundLocal.items || []
        };
      }
    } catch (_) {}

    // 2. Check sample orders
    return sampleOrders.find(
      (o) =>
        o.orderNumber.toUpperCase() === clean ||
        o.customerPhone.replace(/\s/g, '').includes(clean.replace(/\s/g, '')) ||
        o.trackingCode.toUpperCase() === clean
    ) || null;
  };

  useEffect(() => {
    const q = searchParams.get('order') || searchParams.get('id');
    if (q) {
      setInputQuery(q);
      const res = findOrder(q);
      if (res) {
        setActiveOrder(res);
        setNotFound(false);
      } else {
        setActiveOrder(null);
        setNotFound(true);
      }
    } else {
      // Default to latest placed order or first sample order
      try {
        const localOrders = JSON.parse(localStorage.getItem('ips_orders') || '[]');
        if (localOrders.length > 0) {
          const latest = localOrders[0];
          setActiveOrder({
            orderNumber: latest.orderNumber,
            status: latest.status || 'CONFIRMED',
            statusStep: 1,
            date: latest.date || 'Today',
            estimatedDelivery: 'Within 24-48 Hours',
            courierName: 'Oman Express Store Dispatch',
            trackingCode: `TRK-${latest.orderNumber?.replace('ORD-', '')}`,
            customerName: latest.customerName || 'Store Customer',
            customerPhone: latest.customerPhone || '+968 9000 0000',
            customerAddress: latest.customerAddress || 'Express Home Delivery, Oman',
            paymentMethod: latest.paymentMethod || 'Debit Card',
            paymentStatus: latest.paymentStatus || 'PAID',
            subtotal: latest.subtotal || latest.total || 0,
            total: latest.total || 0,
            items: latest.items || []
          });
          setInputQuery(latest.orderNumber);
          return;
        }
      } catch (_) {}
      setActiveOrder(sampleOrders[0]);
      setInputQuery(sampleOrders[0].orderNumber);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    setSearchParams({ order: inputQuery.trim() });
    const res = findOrder(inputQuery);
    if (res) {
      setActiveOrder(res);
      setNotFound(false);
    } else {
      setActiveOrder(null);
      setNotFound(true);
    }
  };

  const steps = [
    { step: 1, titleEn: 'Order Placed', titleAr: 'تم استلام الطلب', descEn: 'Payment verified & order recorded', descAr: 'تم تأكيد الدفع وتسجيل الطلب' },
    { step: 2, titleEn: 'Processing & Packed', titleAr: 'جارٍ التجهيز والتغليف', descEn: 'Items checked & prepared in warehouse', descAr: 'فحص وتغليف المنتجات بعناية' },
    { step: 3, titleEn: 'Out for Delivery', titleAr: 'في الطريق للتسليم', descEn: 'Handed to dispatch courier driver', descAr: 'الطلب بحوزة مندوب التوصيل' },
    { step: 4, titleEn: 'Delivered', titleAr: 'تم التسليم بنجاح', descEn: 'Received by customer', descAr: 'تم تسليم الطلب إلى العميل' }
  ];

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '520px', margin: '4rem auto', textAlign: 'center', padding: '2.5rem 1.5rem', backgroundColor: '#ffffff', borderRadius: '16px', border: '1.5px solid #ebdada', boxShadow: '0 4px 20px rgba(128,0,32,0.06)' }}>
        <Truck size={48} style={{ color: '#800020', margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>
          {isRTL ? 'تسجيل الدخول مطلوب' : 'Authentication Required'}
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          {isRTL ? 'يرجى تسجيل الدخول إلى حسابك لتتبع حالة طلباتك ومتابعة الشحن.' : 'Please sign in to your account to track orders and live delivery status.'}
        </p>
        <Link to="/login" className="btn-primary" style={{ display: 'inline-block', padding: '0.75rem 2rem', textDecoration: 'none' }}>
          {isRTL ? 'تسجيل الدخول' : 'Sign In to Track Orders'}
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#faf9f6', minHeight: 'calc(100vh - 120px)', padding: '2.5rem 1rem 4rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        
        {/* Header Breadcrumb & Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: '#fdf2f4',
            color: '#9E2A2B',
            padding: '0.35rem 0.95rem',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: '700',
            marginBottom: '0.75rem'
          }}>
            <Truck size={15} />
            <span>{isRTL ? 'خدمة تتبع الطلبات المباشرة' : 'Live Order Tracking Service'}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', fontWeight: '900', color: '#1e293b', margin: 0, letterSpacing: '-0.02em' }}>
            {isRTL ? 'تتبع مسار شحنتك' : 'Track Your Order Status'}
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#64748b', marginTop: '0.45rem' }}>
            {isRTL
              ? 'أدخل رقم الطلب الخاص بك لمتابعة حالة الشحن وموعد الوصول لحظة بلحظة.'
              : 'Enter your order number or phone to see live dispatch updates and estimated arrival time.'}
          </p>
        </div>

        {/* Tracking Search Bar */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1.5px solid #ebdada',
          boxShadow: '0 4px 18px rgba(158, 42, 43, 0.05)',
          marginBottom: '2rem'
        }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={18} style={{ position: 'absolute', [isRTL ? 'right' : 'left']: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9E2A2B' }} />
              <input
                type="text"
                placeholder={isRTL ? 'أدخل رقم الطلب (مثال: ORD-2026-92810)...' : 'Enter Order # (e.g. ORD-2026-92810) or phone...'}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: isRTL ? '0.75rem 2.8rem 0.75rem 1rem' : '0.75rem 1rem 0.75rem 2.8rem',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: '#9E2A2B',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem 1.6rem',
                borderRadius: '10px',
                fontSize: '0.92rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 3px 10px rgba(158, 42, 43, 0.25)'
              }}
            >
              <Truck size={17} />
              <span>{isRTL ? 'تتبع الآن' : 'Track Order'}</span>
            </button>
          </form>

          {/* Helpful tracking guidance tip */}
          <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              {isRTL ? 'مثال على رقم التتبع: ORD-2026-92810' : 'Example order reference: ORD-2026-92810'}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: '700' }}>
              ● {isRTL ? 'تحديثات الحالة مباشرة' : 'Live Status Updates'}
            </span>
          </div>
        </div>

        {/* Not Found Notice */}
        {notFound && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fee2e2',
            borderRadius: '14px',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            color: '#dc2626',
            marginBottom: '2rem'
          }}>
            <AlertCircle size={36} style={{ margin: '0 auto 0.75rem', color: '#dc2626' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 0.35rem' }}>
              {isRTL ? 'لم يتم العثور على هذا الطلب' : 'Order Not Found'}
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#991b1b', margin: 0 }}>
              {isRTL
                ? 'يرجى التأكد من كتابة رقم الطلب بالشكل الصحيح (مثال: ORD-2026-92810) أو التواصل مع خدمة العملاء.'
                : 'Please verify the order number format (e.g. ORD-2026-92810) or contact customer support for assistance.'}
            </p>
          </div>
        )}

        {/* Active Order Details & Visual Tracking Progress */}
        {activeOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Top Status Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1.5px solid #ebdada',
              boxShadow: '0 4px 18px rgba(158, 42, 43, 0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {isRTL ? 'رقم تتبع الشحنة' : 'Order Reference'}
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#9E2A2B', margin: '0.2rem 0' }}>
                    {activeOrder.orderNumber}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                    {isRTL ? 'تاريخ الطلب:' : 'Placed on:'} <strong>{activeOrder.date}</strong> • {activeOrder.courierName}
                  </div>
                </div>

                {/* Estimated Delivery Window Pill */}
                <div style={{
                  backgroundColor: '#fdf2f4',
                  border: '1.5px solid #f8d3d8',
                  borderRadius: '12px',
                  padding: '0.75rem 1.15rem',
                  textAlign: isRTL ? 'left' : 'right'
                }}>
                  <span style={{ fontSize: '0.72rem', color: '#9E2A2B', fontWeight: '800', textTransform: 'uppercase', display: 'block' }}>
                    {isRTL ? 'الموعد المتوقع للوصول' : 'Estimated Delivery'}
                  </span>
                  <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#1e293b' }}>
                    {activeOrder.estimatedDelivery}
                  </span>
                </div>
              </div>

              {/* 4-Step Visual Progress Stepper */}
              <div style={{ margin: '2rem 0 1rem' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  position: 'relative',
                  gap: '0.5rem'
                }}>
                  {steps.map((st) => {
                    const isCompleted = activeOrder.statusStep >= st.step;
                    const isCurrent = activeOrder.statusStep === st.step;

                    return (
                      <div key={st.step} style={{ textAlign: 'center', position: 'relative' }}>
                        {/* Step Circle Indicator */}
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          backgroundColor: isCompleted ? '#9E2A2B' : '#f1f5f9',
                          color: isCompleted ? '#ffffff' : '#94a3b8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 0.75rem',
                          fontWeight: '800',
                          fontSize: '0.95rem',
                          border: isCurrent ? '3px solid #D4AF37' : 'none',
                          boxShadow: isCompleted ? '0 4px 12px rgba(158, 42, 43, 0.25)' : 'none',
                          transition: 'all 0.2s ease'
                        }}>
                          {isCompleted ? <CheckCircle2 size={20} /> : st.step}
                        </div>

                        <div style={{
                          fontSize: '0.86rem',
                          fontWeight: isCompleted ? '800' : '600',
                          color: isCompleted ? '#1e293b' : '#64748b',
                          marginBottom: '0.2rem'
                        }}>
                          {isRTL ? st.titleAr : st.titleEn}
                        </div>

                        <div style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: '1.3' }} className="hide-mobile">
                          {isRTL ? st.descAr : st.descEn}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Recipient & Shipping Information Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}>
              {/* Delivery Address Card */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                padding: '1.25rem',
                border: '1px solid #ebdada'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9E2A2B', fontWeight: '800', fontSize: '0.88rem', marginBottom: '0.85rem' }}>
                  <MapPin size={18} />
                  <span>{isRTL ? 'عنوان التسليم والاتصال' : 'Delivery Destination'}</span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>
                  {activeOrder.customerName}
                </div>
                <div style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '0.45rem', lineHeight: '1.4' }}>
                  {activeOrder.customerAddress}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#9E2A2B', fontWeight: '600' }}>
                  <Phone size={14} />
                  <span>{activeOrder.customerPhone}</span>
                </div>
              </div>

              {/* Payment Details Card */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                padding: '1.25rem',
                border: '1px solid #ebdada'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9E2A2B', fontWeight: '800', fontSize: '0.88rem', marginBottom: '0.85rem' }}>
                  {activeOrder.paymentMethod === 'Debit Card' ? <CreditCard size={18} /> : <Banknote size={18} />}
                  <span>{isRTL ? 'تفاصيل الدفع والمبلغ' : 'Payment Information'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.84rem', color: '#64748b' }}>Method:</span>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    color: activeOrder.paymentStatus === 'PAID' ? '#16a34a' : '#d97706',
                    backgroundColor: activeOrder.paymentStatus === 'PAID' ? '#dcfce7' : '#fef3c7',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px'
                  }}>
                    {activeOrder.paymentMethod} • {activeOrder.paymentStatus}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b' }}>
                    {isRTL ? 'المجموع النهائي:' : 'Total Amount:'}
                  </span>
                  <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#9E2A2B' }}>
                    OMR {activeOrder.total?.toFixed ? activeOrder.total.toFixed(3) : activeOrder.total}
                  </span>
                </div>
              </div>
            </div>

            {/* Itemized Order Package Details */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1.5px solid #ebdada'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: '0 0 1rem' }}>
                {isRTL ? 'محتويات الشحنة والمنتجات' : 'Package Contents'} ({activeOrder.items.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {activeOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #f1f5f9',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={it.image || '/products/polo-shirt-front.jpg'}
                        alt=""
                        style={{ width: '48px', height: '48px', objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '3px' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b' }}>
                          {isRTL ? it.nameAr : it.nameEn}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                          Size: <strong>{it.size || 'Standard'}</strong> • Qty: <strong>{it.quantity}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#9E2A2B' }}>
                      OMR {((it.price || 0) * (it.quantity || 1)).toFixed(3)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Quick Help & Action Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid #f1f5f9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.84rem' }}>
                  <ShieldCheck size={16} color="#16a34a" />
                  <span>{isRTL ? 'خدمة عملاء ودعم الشحن: +968 23 234567' : 'Customer dispatch support: +968 23 234567'}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button
                    onClick={() => window.print()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#475569',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    <Printer size={15} />
                    <span>{isRTL ? 'طباعة' : 'Print'}</span>
                  </button>

                  <Link
                    to="/uniforms"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: '#9E2A2B',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      fontWeight: '800',
                      textDecoration: 'none'
                    }}
                  >
                    <span>{isRTL ? 'متابعة التسوق' : 'Continue Shopping'}</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

