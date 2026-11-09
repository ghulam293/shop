import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    schoolName: "International Pioneers School (Salalah)",
    schoolNameAr: "مدرسة الرواد الدولية (صلالة)",
    schoolShop: "School Shop",
    shopTagline: "Shop official IPS Oman school uniforms and supplies",
    home: "Home",
    uniforms: "Uniforms",
    books: "Books",
    stationery: "Stationery",
    bags: "Bags",
    allProducts: "All Products",
    shoes: "Shoes",
    accessories: "Accessories",
    myOrders: "My Orders",
    help: "Help",
    searchPlaceholder: "Search for uniforms, shoes, books...",
    searchBtn: "Search",
    wishlist: "Wishlist",
    cart: "Cart",
    parentLogin: "Login",
    myAccount: "My Account",
    logout: "Logout",
    shopNow: "Shop Now",
    heroTitle: "IPS Oman School Shopping",
    heroSubtitle: "Official School Uniforms & Educational Essentials",
    trustUniforms: "Official School Uniforms",
    trustUniformsSub: "Approved by IPS",
    trustQuality: "Quality & Durable",
    trustQualitySub: "Materials",
    trustDelivery: "Reliable Delivery",
    trustDeliverySub: "School Pickup Options",
    trustPayment: "Secure Online Payment",
    trustPaymentSub: "Safe Checkout",
    trustSupport: "Parent Support",
    trustSupportSub: "& Order Assistance",
    shopByCategory: "Shop by Category",
    recommendedWithItem: "Recommended with This Item",
    size: "Size",
    quantity: "Quantity",
    addToCart: "Add to Cart",
    addToWishlist: "Add to Wishlist",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    reviews: "Reviews",
    schoolApproved: "School Approved Uniform",
    qualityFabric: "Quality Fabric & Durable",
    easyExchange: "Easy Exchange",
    secureShopping: "Secure Shopping",
    sortBy: "Sort by: Featured",
    currency: "OMR",
  },
  ar: {
    schoolName: "مدرسة الرواد الدولية (صلالة)",
    schoolNameAr: "International Pioneers School (Salalah)",
    schoolShop: "متجر المدرسة",
    shopTagline: "تسوق الزي المدرسي والمستلزمات التعليمية الرسمية لمدرسة الرواد",
    home: "الرئيسية",
    uniforms: "الزي المدرسي",
    books: "الكتب المدرسية",
    stationery: "القرطاسية",
    bags: "الحقائب المدرسية",
    allProducts: "جميع المنتجات",
    shoes: "الأحذية",
    accessories: "الملحقات والإكسسوارات",
    myOrders: "طلباتي",
    help: "المساعدة",
    searchPlaceholder: "البحث عن الزي، الأحذية، الكتب...",
    searchBtn: "بحث",
    wishlist: "المفضلة",
    cart: "السلة",
    parentLogin: "تسجيل الدخول",
    myAccount: "حسابي",
    logout: "تسجيل الخروج",
    shopNow: "تسوق الآن",
    heroTitle: "متجر مدرسة الرواد الدولية - عُمان",
    heroSubtitle: "الزي المدرسي والمستلزمات التعليمية المعتمدة",
    trustUniforms: "زي مدرسي معتمد",
    trustUniformsSub: "معتمد من إدارة المدرسة",
    trustQuality: "جودة ومتانة عالية",
    trustQualitySub: "أقمشة تدوم طويلاً",
    trustDelivery: "توصيل واستلام موثوق",
    trustDeliverySub: "خيارات استلام من المدرسة",
    trustPayment: "دفع إلكتروني آمن",
    trustPaymentSub: "تسوق آمن ومحمي",
    trustSupport: "دعم أولياء الأمور",
    trustSupportSub: "ومساعدة فورية في الطلبات",
    shopByCategory: "تسوق حسب الفئة",
    recommendedWithItem: "منتجات موصى بها مع هذا المنتج",
    size: "المقاس",
    quantity: "الكمية",
    addToCart: "أضف إلى السلة",
    addToWishlist: "أضف للمفضلة",
    inStock: "متوفر بالمخزون",
    outOfStock: "غير متوفر حالياً",
    reviews: "تقييمات",
    schoolApproved: "زي مدرسي معتمد رسمياً",
    qualityFabric: "أقمشة عالية الجودة ومريحة",
    easyExchange: "استبدال سهل للمقاسات",
    secureShopping: "تسوق إلكتروني آمن",
    sortBy: "ترتيب حسب: المميز",
    currency: "ر.ع.",
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    if (lang === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  const isRTL = lang === 'ar';

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

