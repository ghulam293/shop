import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    companyName: "Shop",
    companyNameAr: "المتجر",
    schoolName: "Shop",
    schoolNameAr: "المتجر",
    schoolShop: "Shop",
    shopTagline: "Premier destination for school uniforms, footwear, books, bags and accessories",
    home: "Home",
    departments: "Categories",
    uniforms: "Uniforms",
    books: "Books",
    stationery: "Stationery",
    bags: "Bags",
    allProducts: "All Products",
    shoes: "Shoes",
    accessories: "Accessories",
    myOrders: "My Orders",
    help: "Help",
    searchPlaceholder: "Search products (uniforms, trousers, shoes, books, stationery...)",
    searchBtn: "Search",
    wishlist: "Wishlist",
    cart: "Cart",
    parentLogin: "Login",
    myAccount: "My Account",
    logout: "Logout",
    shopNow: "Shop Now",
    heroTitle: "Shop",
    heroSubtitle: "Your premier destination for official uniforms, shoes, books, and educational essentials",
    trustUniforms: "Official Uniforms",
    trustUniformsSub: "Approved Quality Standards",
    trustQuality: "Premium Quality",
    trustQualitySub: "Durable & Certified Fabrics",
    trustDelivery: "Fast Delivery",
    trustDeliverySub: "Doorstep & Store Pickup",
    trustPayment: "Debit Card & Cash on Delivery",
    trustPaymentSub: "100% Safe & Certified",
    trustSupport: "Customer Support",
    trustSupportSub: "Dedicated Assistance & Returns",
    shopByCategory: "Shop by Category",
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
    companyName: "المتجر",
    companyNameAr: "Shop",
    schoolName: "المتجر",
    schoolNameAr: "Shop",
    schoolShop: "المتجر",
    shopTagline: "وجهتكم المتكاملة لمستلزمات المدرسة، الزي المعتمد، الكتب والحقائب",
    home: "الرئيسية",
    departments: "الفئات والأقسام",
    uniforms: "الزي المدرسي",
    books: "الكتب",
    stationery: "القرطاسية",
    bags: "الحقائب",
    allProducts: "جميع المنتجات",
    shoes: "الأحذية",
    accessories: "الإكسسوارات",
    myOrders: "طلباتي",
    help: "المساعدة",
    searchPlaceholder: "البحث عن المنتجات (الزي، البناطيل، الأحذية، الكتب، القرطاسية...)",
    searchBtn: "بحث",
    wishlist: "المفضلة",
    cart: "السلة",
    parentLogin: "تسجيل الدخول",
    myAccount: "حسابي",
    logout: "تسجيل الخروج",
    shopNow: "تسوق الآن",
    heroTitle: "المتجر",
    heroSubtitle: "وجهتكم المتكاملة لتسوق الزي المدرسي المعتمد، الأحذية، الحقائب والكتب",
    trustUniforms: "أزياء معتمدة",
    trustUniformsSub: "معايير مطابقة رسمية",
    trustQuality: "معايير جودة عالية",
    trustQualitySub: "أقمشة متينة ومختارة بعناية",
    trustDelivery: "توصيل سريع",
    trustDeliverySub: "توصيل للباب واستلام من المتجر",
    trustPayment: "بطاقة بنكية والدفع عند الاستلام",
    trustPaymentSub: "دفع آمن وفوري وموثوق",
    trustSupport: "خدمة العملاء",
    trustSupportSub: "متابعة فورية للطلبات والاستبدال",
    shopByCategory: "تسوق حسب الفئة",
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

