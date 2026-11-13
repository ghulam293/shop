import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    companyName: "Empowering International Innovations (L.L.C)",
    companyNameAr: "تمكين الابتكارات الدولية (ش.م.م)",
    schoolName: "Empowering International Innovations (L.L.C)",
    schoolNameAr: "تمكين الابتكارات الدولية (ش.م.م)",
    schoolShop: "Shop All Departments",
    shopTagline: "Premier destination for school, family, tech, health and travel essentials",
    home: "Home",
    departments: "Departments",
    uniforms: "School & Apparel",
    books: "Books & Study",
    stationery: "Stationery",
    bags: "Bags & Luggage",
    allProducts: "All Products",
    shoes: "Footwear",
    accessories: "Accessories",
    myOrders: "My Orders",
    help: "Help",
    searchPlaceholder: "Search across all 11 departments (uniforms, tech, books, bags...)",
    searchBtn: "Search",
    wishlist: "Wishlist",
    cart: "Cart",
    parentLogin: "Login",
    myAccount: "My Account",
    logout: "Logout",
    shopNow: "Explore Departments",
    heroTitle: "Empowering International Innovations",
    heroSubtitle: "A premier shop bringing 11 essential product departments together in one place",
    trustUniforms: "11 Product Departments",
    trustUniformsSub: "Curated Quality Selection",
    trustQuality: "Premium Quality",
    trustQualitySub: "Verified & Durable Items",
    trustDelivery: "Convenient Delivery",
    trustDeliverySub: "Doorstep & Pickup Options",
    trustPayment: "Secure Payments",
    trustPaymentSub: "Safe Cash & Digital Billing",
    trustSupport: "Customer Support",
    trustSupportSub: "Dedicated Order Assistance",
    shopByCategory: "Explore Our 11 Departments",
    recommendedWithItem: "Recommended with This Item",
    size: "Option / Size",
    quantity: "Quantity",
    addToCart: "Add to Cart",
    addToWishlist: "Add to Wishlist",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    reviews: "Reviews",
    schoolApproved: "Premium Certified Quality",
    qualityFabric: "Durable & Tested Materials",
    easyExchange: "Easy Exchange Policy",
    secureShopping: "Secure Shopping",
    sortBy: "Sort by: Featured",
    currency: "OMR",
  },
  ar: {
    companyName: "تمكين الابتكارات الدولية (ش.م.م)",
    companyNameAr: "Empowering International Innovations (L.L.C)",
    schoolName: "تمكين الابتكارات الدولية (ش.م.م)",
    schoolNameAr: "Empowering International Innovations (L.L.C)",
    schoolShop: "تصفح جميع الأقسام",
    shopTagline: "وجهتكم المتكاملة لمستلزمات المدرسة، العائلة، التكنولوجيا ونمط الحياة",
    home: "الرئيسية",
    departments: "الأقسام والمنتجات",
    uniforms: "الزي والملابس",
    books: "الكتب والمراجع",
    stationery: "القرطاسية",
    bags: "الحقائب والأمتعة",
    allProducts: "جميع الأقسام",
    shoes: "الأحذية",
    accessories: "الملحقات والإكسسوارات",
    myOrders: "طلباتي",
    help: "المساعدة",
    searchPlaceholder: "البحث في جميع الأقسام الـ 11 (الزي، الأجهزة، الحقائب، الكتب...)",
    searchBtn: "بحث",
    wishlist: "المفضلة",
    cart: "السلة",
    parentLogin: "تسجيل الدخول",
    myAccount: "حسابي",
    logout: "تسجيل الخروج",
    shopNow: "استكشف الأقسام الـ 11",
    heroTitle: "تمكين الابتكارات الدولية (ش.م.م)",
    heroSubtitle: "متجر شامل يجمع أحد عشر قسماً رئيسياً لتلبية كافة احتياجاتكم في وجهة واحدة",
    trustUniforms: "11 قسماً متخصصاً",
    trustUniformsSub: "خيارات متنوعة ومتكاملة",
    trustQuality: "معايير جودة عالية",
    trustQualitySub: "منتجات معتمدة ومختارة بعناية",
    trustDelivery: "توصيل واستلام مرن",
    trustDeliverySub: "توصيل للباب واستلام من المتجر",
    trustPayment: "دفع آمن وموثوق",
    trustPaymentSub: "خيارات سداد رقمي ونقدي",
    trustSupport: "خدمة عملاء متميزة",
    trustSupportSub: "متابعة فورية للطلبات والاستفسارات",
    shopByCategory: "استكشف أقسام المتجر الـ 11",
    recommendedWithItem: "منتجات مقترحة تناسب طلبك",
    size: "المقاس / النوع",
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

