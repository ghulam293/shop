import React, { useState, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Filter, ChevronDown, Check, Lock, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { useLanguage } from '../context/LanguageContext.js';
import { useAuth } from '../context/AuthContext.js';

export default function UniformsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { t, isRTL } = useLanguage();
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [addedItem, setAddedItem] = useState(null);
  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const [sortBy, setSortBy] = useState('featured');

  // Complete catalog covering all 11 departments from Shop_Proposal.pdf with high-resolution photos
  const allProducts = [
    {
      id: 1,
      category: 'school-uniforms',
      sku: 'UNIF-POLO-MRN',
      nameEn: 'Official Polo Shirt (Maroon)',
      nameAr: 'قميص بولو مدرسي رسمي (عنابي)',
      descEn: 'Breathable cotton pique polo shirt with contrast gold collar',
      descAr: 'قميص بولو قطني مريح بياقة مذهبة أنيقة للمدرسة',
      price: 6.000,
      image: '/products/polo-shirt-front.jpg',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      defaultSize: 'M',
      dept: 'Department 1'
    },
    {
      id: 2,
      category: 'school-uniforms',
      subCategory: 'boys-trousers',
      sku: 'UNIF-TRSR-GRY',
      nameEn: "Boys' Formal Trousers (Gray)",
      nameAr: 'بنطال رمادي رسمي للأولاد',
      descEn: 'Regular fit durable school trousers with adjustable waist',
      descAr: 'بنطال مدرسي رمادي مريح للأولاد بخياطة متينة ومقاس مريح',
      price: 8.500,
      image: '/products/boys-gray-trousers.jpg',
      sizes: ['26', '28', '30', '32', '34', '36'],
      defaultSize: '30',
      dept: 'Department 1'
    },
    {
      id: 3,
      category: 'school-uniforms',
      subCategory: 'girls-skirts',
      sku: 'UNIF-SKRT-GRY',
      nameEn: "Girls' Pleated Skirt (Gray)",
      nameAr: 'تنورة رمادية بكسرات للبنات',
      descEn: 'Comfortable classic pleated school skirt with wrinkle resistance',
      descAr: 'تنورة مدرسية مريحة بكسرات أنيقة وقماش متين مقاوم للتجعد',
      price: 8.000,
      image: '/products/girls-gray-skirt.jpg',
      sizes: ['26', '28', '30', '32', '34', '36'],
      defaultSize: '28',
      dept: 'Department 1'
    },
    {
      id: 4,
      category: 'shoes',
      sku: 'SHOE-BOY-BLK',
      nameEn: "Boys' Oxford Shoes (Black Leather)",
      nameAr: 'حذاء جلدي رسمي أسود للأولاد',
      descEn: 'Genuine scuff-resistant leather with non-marking rubber outsole',
      descAr: 'حذاء جلدي متين ومريح للأولاد للمدرسة بنعل طبي مانع للانزلاق',
      price: 12.500,
      image: '/products/boys-black-shoes.jpg',
      sizes: ['32', '34', '36', '38', '40', '42'],
      defaultSize: '36',
      dept: 'Department 1'
    },
    {
      id: 5,
      category: 'shoes',
      sku: 'SHOE-GRL-BLK',
      nameEn: "Girls' Mary Jane Shoes (Black)",
      nameAr: 'حذاء ماري جين أسود للبنات',
      descEn: 'Classic Mary Jane leather shoe with supportive arch insole',
      descAr: 'حذاء كلاسيكي أنيق ومريح للبنات للمدرسة بحزام مريح',
      price: 12.500,
      image: '/products/girls-black-shoes.jpg',
      sizes: ['30', '32', '34', '36', '38', '40'],
      defaultSize: '34',
      dept: 'Department 1'
    },
    {
      id: 6,
      category: 'accessories',
      sku: 'ACCS-BELT-SET',
      nameEn: 'Official Uniform Belt & Accessories',
      nameAr: 'حزام مدرسي جلدي وإكسسوارات',
      descEn: 'Sturdy black synthetic leather belt with polished silver buckle',
      descAr: 'حزام جلدي أسود أنيق قابل للتعديل ومتين لجميع الأعمار',
      price: 2.500,
      image: '/products/school-accessories-set.jpg',
      sizes: ['Standard'],
      defaultSize: 'Standard',
      dept: 'Department 1'
    },
    {
      id: 7,
      category: 'accessories',
      sku: 'ACCS-SOCK-WHT',
      nameEn: 'Cotton School Socks (White Pair)',
      nameAr: 'جوارب مدرسية بيضاء قطنية (زوج)',
      descEn: 'Breathable combed cotton socks with reinforced heel and toe',
      descAr: 'جوارب قطنية ناعمة ومتينة تدوم طويلاً مع الغسيل المتكرر',
      price: 1.000,
      image: '/products/school-socks-white.jpg',
      sizes: ['S (28-33)', 'M (34-38)', 'L (39-44)'],
      defaultSize: 'M (34-38)',
      dept: 'Department 1'
    },
    {
      id: 8,
      category: 'stationery-books',
      sku: 'BOOK-ENG-P1',
      nameEn: "Cambridge Primary English Learner's Book",
      nameAr: 'كتاب كامبريدج للغة الإنجليزية (الابتدائي)',
      descEn: 'Official Cambridge curriculum textbook for English learners',
      descAr: 'كتاب الطالب المعتمد لمنهاج كامبريدج الدولي للغة الإنجليزية',
      price: 7.500,
      image: '/products/cambridge-english-book.jpg',
      sizes: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6'],
      defaultSize: 'Stage 3',
      dept: 'Department 3'
    },
    {
      id: 9,
      category: 'stationery-books',
      sku: 'BOOK-MTH-P1',
      nameEn: "Cambridge Primary Mathematics Learner's Book",
      nameAr: 'كتاب كامبريدج للرياضيات (الابتدائي)',
      descEn: 'Official Cambridge curriculum textbook for Mathematics',
      descAr: 'كتاب الرياضيات المعتمد لمنهاج كامبريدج للتعليم الأساسي',
      price: 7.500,
      image: '/products/cambridge-math-book.jpg',
      sizes: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6'],
      defaultSize: 'Stage 3',
      dept: 'Department 3'
    },
    {
      id: 10,
      category: 'stationery-books',
      sku: 'BOOK-ARB-P1',
      nameEn: 'Arabic Language Curriculum Textbook',
      nameAr: 'كتاب لغتي الجميلة — منهاج اللغة العربية',
      descEn: 'Official curriculum Arabic textbook for grammar and reading',
      descAr: 'كتاب اللغة العربية المعتمد للقراءة والنحو والإملاء',
      price: 6.500,
      image: '/products/arabic-language-book.jpg',
      sizes: ['Grade 1-3', 'Grade 4-6', 'Grade 7-9'],
      defaultSize: 'Grade 4-6',
      dept: 'Department 3'
    },
    {
      id: 11,
      category: 'stationery-books',
      sku: 'BOOK-SCI-P1',
      nameEn: 'Cambridge Primary Science Textbook',
      nameAr: 'كتاب كامبريدج للعلوم العامة والاكتشاف',
      descEn: 'Official Science learner textbook with practical investigations',
      descAr: 'كتاب العلوم والتجارب المعتمد لمنهاج كامبريدج الدولي',
      price: 7.500,
      image: '/products/cambridge-science-book.jpg',
      sizes: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6'],
      defaultSize: 'Stage 4',
      dept: 'Department 3'
    },
    {
      id: 12,
      category: 'school-bags',
      sku: 'BAG-SPINE-MRN',
      nameEn: 'Ergonomic Spine-Support School Backpack',
      nameAr: 'حقيبة مدرسية طبية مريحة مع مقلمة',
      descEn: 'Multi-compartment water-resistant backpack with laptop sleeve',
      descAr: 'حقيبة ظهر طبية مريحة مبطنة لدعم العمود الفقري ومقاومة للماء',
      price: 14.500,
      image: '/products/school-bags-accessories.jpg',
      sizes: ['Junior (Grades 1-4)', 'Senior (Grades 5-12)'],
      defaultSize: 'Senior (Grades 5-12)',
      dept: 'Department 2'
    },
    {
      id: 13,
      category: 'lunch-boxes',
      sku: 'LUNCH-BENTO-SET',
      nameEn: 'Thermal Bento Lunch Box & Water Bottle Set',
      nameAr: 'طقم حافظة طعام ومطارة ماء عازلة للحرارة',
      descEn: 'BPA-free leakproof lunch container with stainless steel bottle',
      descAr: 'حافظة طعام مانعة للتسرب صحية مع مطارة ماء ستانلس ستيل عازلة',
      price: 5.500,
      image: '/products/lunch-boxes-drinkware.jpg',
      sizes: ['Standard (750ml)', 'Large (1000ml)'],
      defaultSize: 'Standard (750ml)',
      dept: 'Department 4'
    },
    {
      id: 14,
      category: 'healthcare',
      sku: 'HLTH-KIT-DIGI',
      nameEn: 'Comprehensive First-Aid & Hygiene Care Kit',
      nameAr: 'حقيبة الإسعافات الأولية ومستلزمات العناية',
      descEn: 'Complete first-aid kit with infrared thermometer & sanitizers',
      descAr: 'طقم متكامل للإسعافات الأولية، ميزان حرارة إلكتروني ومعقمات طبية',
      price: 6.800,
      image: '/products/healthcare-personal-care.jpg',
      sizes: ['Standard Kit', 'Deluxe Family Pack'],
      defaultSize: 'Standard Kit',
      dept: 'Department 5'
    },
    {
      id: 15,
      category: 'fitness-sports',
      sku: 'SPRT-TRAIN-SET',
      nameEn: 'Athletics Training Dumbbells & Sports Gear',
      nameAr: 'أثقال تدريب رياضية ومستلزمات اللياقة',
      descEn: 'Neoprene coated dumbbells, skipping rope & athletic ball',
      descAr: 'أثقال تدريب مغلفة بالنيوبرين، حبل قفز سريع وكرة رياضية',
      price: 11.500,
      image: '/products/fitness-sports-equipment.jpg',
      sizes: ['2kg Pair', '3kg Pair', '5kg Pair'],
      defaultSize: '3kg Pair',
      dept: 'Department 6'
    },
    {
      id: 16,
      category: 'electronics',
      sku: 'ELEC-CALC-FAST',
      nameEn: 'Scientific Calculator & Fast Charging Tech Kit',
      nameAr: 'آلة حاسبة علمية وطقم شحن سريع وكابلات',
      descEn: 'Approved scientific calculator, USB-C braided cable & power bank',
      descAr: 'آلة حاسبة علمية معتمدة للاختبارات وشاحن سريع وبطارية طوارئ',
      price: 8.500,
      image: '/products/electronics-mobile-accessories.jpg',
      sizes: ['Exam Standard'],
      defaultSize: 'Exam Standard',
      dept: 'Department 7'
    },
    {
      id: 17,
      category: 'toys-educational',
      sku: 'TOYS-STEM-BLKS',
      nameEn: 'STEM Science Experiment Kit & Wooden Puzzles',
      nameAr: 'طقم تجارب علمية STEM ومكعبات تعليمية',
      descEn: 'Hands-on learning science kit with geometric puzzle blocks',
      descAr: 'طقم أنشطة وتجارب علمية ممتعة مع مكعبات ذكاء للأطفال',
      price: 9.500,
      image: '/products/toys-educational-products.jpg',
      sizes: ['Age 4-8', 'Age 8-14'],
      defaultSize: 'Age 8-14',
      dept: 'Department 8'
    },
    {
      id: 18,
      category: 'gifts-craft',
      sku: 'ART-PALET-KIT',
      nameEn: 'Artist Acrylic Palette & Craft Painting Set',
      nameAr: 'طقم ألوان وفراشي رسم وأشغال فنية يدوية',
      descEn: 'Rich pigment paint tubes, wooden mixing palette & brushes',
      descAr: 'ألوان رسم ناصعة مع باليتة خشبية ومجموعة فراشي احترافية',
      price: 4.800,
      image: '/products/gifts-art-craft.jpg',
      sizes: ['12-Color Set', '24-Color Set'],
      defaultSize: '24-Color Set',
      dept: 'Department 9'
    },
    {
      id: 19,
      category: 'household',
      sku: 'HOME-STOR-ORGN',
      nameEn: 'Multipurpose Home & Study Storage Organizers',
      nameAr: 'صناديق تنظيم وترتيب منزلية ومكتبية',
      descEn: 'Stackable transparent storage boxes with handle dispensers',
      descAr: 'صناديق ترتيب أنيقة ومتينة للمنزل والمكتب بأحجام متعددة',
      price: 5.200,
      image: '/products/household-daily-essentials.jpg',
      sizes: ['Medium 3-Pack', 'Large 2-Pack'],
      defaultSize: 'Medium 3-Pack',
      dept: 'Department 10'
    },
    {
      id: 20,
      category: 'travel-outdoor',
      sku: 'TRVL-DUFF-BAG',
      nameEn: 'Waterproof Travel Luggage Duffel & Outdoor Bag',
      nameAr: 'حقيبة سفر ورحلات خارجية متينة مقاومة للماء',
      descEn: 'Reinforced travel duffel with organizer pouches and strap',
      descAr: 'حقيبة سفر ورحلات خارجية متينة مع منظمات مدمجة وحزام كتف مريح',
      price: 13.000,
      image: '/products/travel-outdoor-accessories.jpg',
      sizes: ['Medium (35L)', 'Large (55L)'],
      defaultSize: 'Medium (35L)',
      dept: 'Department 11'
    }
  ];

  // Filtering
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Category match
      if (selectedCategory !== 'all') {
        const matchesCategory =
          product.category === selectedCategory ||
          product.subCategory === selectedCategory ||
          (selectedCategory === 'school-uniforms' && (product.category === 'school-uniforms' || product.subCategory === 'boys-trousers' || product.subCategory === 'girls-skirts')) ||
          (selectedCategory === 'boys-trousers' && product.subCategory === 'boys-trousers') ||
          (selectedCategory === 'girls-skirts' && product.subCategory === 'girls-skirts') ||
          (selectedCategory === 'shoes' && product.category === 'shoes') ||
          (selectedCategory === 'accessories' && product.category === 'accessories') ||
          (selectedCategory === 'stationery-books' && product.category === 'stationery-books') ||
          (selectedCategory === 'school-bags' && product.category === 'school-bags') ||
          (selectedCategory === 'lunch-boxes' && product.category === 'lunch-boxes') ||
          (selectedCategory === 'healthcare' && product.category === 'healthcare') ||
          (selectedCategory === 'fitness-sports' && product.category === 'fitness-sports') ||
          (selectedCategory === 'electronics' && product.category === 'electronics') ||
          (selectedCategory === 'toys-educational' && product.category === 'toys-educational') ||
          (selectedCategory === 'gifts-craft' && product.category === 'gifts-craft') ||
          (selectedCategory === 'household' && product.category === 'household') ||
          (selectedCategory === 'travel-outdoor' && product.category === 'travel-outdoor');
        if (!matchesCategory) return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matches =
          product.nameEn.toLowerCase().includes(query) ||
          product.nameAr.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.descEn.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return a.id - b.id;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: { pathname: '/uniforms' },
          message: isRTL ? 'يرجى تسجيل الدخول أولاً لإتمام الشراء والطلب.' : 'Please log in to purchase and place an order.'
        }
      });
      return;
    }
    addToCart(product, product.defaultSize, 1);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 1800);
  };

  // Complete departments list matching Shop_Proposal.pdf with high-resolution landscape images
  const categoriesList = [
    { id: 'all', label: isRTL ? 'جميع الأقسام الـ 11' : 'All 11 Departments', count: 20, image: '/products/polo-shirt-front.jpg' },
    { id: 'school-uniforms', label: isRTL ? '1. الزي المدرسي والملابس' : '1. School Uniforms & Clothing', count: 3, image: '/products/polo-shirt-front.jpg' },
    { id: 'boys-trousers', label: isRTL ? '• بناطيل الأولاد' : "• Boys' Trousers", count: 1, image: '/products/boys-gray-trousers.jpg' },
    { id: 'girls-skirts', label: isRTL ? '• تنانير البنات' : "• Girls' Skirts", count: 1, image: '/products/girls-gray-skirt.jpg' },
    { id: 'shoes', label: isRTL ? '• الأحذية المدرسية' : '• School Shoes', count: 2, image: '/products/boys-black-shoes.jpg' },
    { id: 'accessories', label: isRTL ? '• الإكسسوارات (أحزمة وجوارب)' : '• Belts & Socks', count: 2, image: '/products/school-accessories-set.jpg' },
    { id: 'school-bags', label: isRTL ? '2. الحقائب المدرسية والمستلزمات' : '2. School Bags & Accessories', count: 1, image: '/products/school-bags-accessories.jpg' },
    { id: 'stationery-books', label: isRTL ? '3. الكتب والقرطاسية' : '3. Stationery & Books', count: 4, image: '/products/cambridge-english-book.jpg' },
    { id: 'lunch-boxes', label: isRTL ? '4. علب الطعام ومطارات المشروبات' : '4. Lunch Boxes & Drinkware', count: 1, image: '/products/lunch-boxes-drinkware.jpg' },
    { id: 'healthcare', label: isRTL ? '5. الرعاية الصحية والعناية' : '5. Healthcare & Personal Care', count: 1, image: '/products/healthcare-personal-care.jpg' },
    { id: 'fitness-sports', label: isRTL ? '6. اللياقة والرياضة' : '6. Fitness & Sports Equipment', count: 1, image: '/products/fitness-sports-equipment.jpg' },
    { id: 'electronics', label: isRTL ? '7. الإلكترونيات وملحقات الهاتف' : '7. Electronics & Mobile', count: 1, image: '/products/electronics-mobile-accessories.jpg' },
    { id: 'toys-educational', label: isRTL ? '8. ألعاب الذكاء والتعليم' : '8. Toys & Educational', count: 1, image: '/products/toys-educational-products.jpg' },
    { id: 'gifts-craft', label: isRTL ? '9. الهدايا والأعمال الفنية' : '9. Gifts, Art & Craft', count: 1, image: '/products/gifts-art-craft.jpg' },
    { id: 'household', label: isRTL ? '10. المستلزمات المنزلية' : '10. Household & Daily', count: 1, image: '/products/household-daily-essentials.jpg' },
    { id: 'travel-outdoor', label: isRTL ? '11. السفر والرحلات' : '11. Travel & Outdoor', count: 1, image: '/products/travel-outdoor-accessories.jpg' }
  ];

  return (
    <div className="uniforms-page-container">
      {/* Top Banner */}
      <div className="uniforms-hero-bar" style={{ backgroundColor: '#ffffff', borderBottom: '1.5px solid #ebdada', padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: '#800020', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
              <Sparkles size={15} color="#D4AF37" />
              <span>{isRTL ? 'المتجر الشامل' : 'Official Store Catalog'}</span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: '900', color: '#111827', margin: 0 }}>
              {isRTL ? 'جميع المنتجات والأقسام الـ 11' : 'All Products & 11 Departments'}
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#6b7280', margin: '3px 0 0' }}>
              {filteredProducts.length} {isRTL ? 'منتجات متوفرة بجودة عالية' : 'high-quality products in stock'}
            </p>
          </div>

          {/* Quick Login Bar if Unauthenticated */}
          {!isAuthenticated && (
            <div style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '10px',
              padding: '0.65rem 0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontSize: '0.82rem'
            }}>
              <Lock size={16} color="#b45309" />
              <span style={{ color: '#92400e', fontWeight: '600' }}>
                {isRTL ? 'تسجيل الدخول مطلوب للشراء' : 'Login required to checkout'}
              </span>
              <button
                type="button"
                onClick={() => login('demo@shop.com', 'customer123')}
                style={{
                  backgroundColor: '#800020',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  fontWeight: '700',
                  fontSize: '0.76rem',
                  cursor: 'pointer'
                }}
              >
                ⚡ {isRTL ? 'دخول فوري' : '1-Click Login'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1360px', margin: '2rem auto', padding: '0 1rem', display: 'flex', gap: '1.75rem', alignItems: 'flex-start' }}>
        
        {/* Left Sidebar Category Filter with High-Resolution Landscape Photos */}
        <aside style={{
          width: '290px',
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1.5px solid #ebdada',
          padding: '1.25rem 1rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          flexShrink: 0
        }} className="hide-mobile">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f3e8eb' }}>
            <Filter size={18} color="#800020" />
            <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#111827', margin: 0 }}>
              {isRTL ? 'الأقسام الـ 11' : '11 Departments'}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '72vh', overflowY: 'auto' }}>
            {categoriesList.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSearchParams({ category: cat.id })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.45rem 0.55rem',
                    borderRadius: '8px',
                    border: active ? '1.5px solid #800020' : '1px solid transparent',
                    backgroundColor: active ? '#fdf2f4' : 'transparent',
                    color: active ? '#800020' : '#374151',
                    fontWeight: active ? '800' : '600',
                    fontSize: '0.82rem',
                    textAlign: isRTL ? 'right' : 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <img
                    src={cat.image}
                    alt=""
                    style={{
                      width: '42px',
                      height: '32px',
                      borderRadius: '6px',
                      objectFit: 'cover',
                      border: '1px solid #ebdada',
                      flexShrink: 0
                    }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cat.label}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: '700' }}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Product Grid */}
        <main style={{ flex: 1 }}>
          
          {/* Controls Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            backgroundColor: '#ffffff',
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            border: '1px solid #ebdada',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '0.86rem', color: '#6b7280' }}>
              {isRTL ? 'عرض' : 'Showing'} <strong>{filteredProducts.length}</strong> {isRTL ? 'منتجات' : 'products'}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.84rem', color: '#374151', fontWeight: '600' }}>
                {isRTL ? 'الترتيب:' : 'Sort:'}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.84rem',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  fontWeight: '600'
                }}
              >
                <option value="featured">{isRTL ? 'المميز' : 'Featured'}</option>
                <option value="price_asc">{isRTL ? 'السعر: من الأقل' : 'Price: Low to High'}</option>
                <option value="price_desc">{isRTL ? 'السعر: من الأعلى' : 'Price: High to Low'}</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.25rem'
          }}>
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: '1.5px solid #ebdada',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {/* Department Chip */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  [isRTL ? 'right' : 'left']: '10px',
                  zIndex: 2,
                  backgroundColor: '#800020',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  padding: '0.18rem 0.55rem',
                  borderRadius: '9999px'
                }}>
                  {prod.dept}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(prod)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    [isRTL ? 'left' : 'right']: '10px',
                    zIndex: 2,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    border: '1px solid #e5e7eb',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Heart size={16} color={isInWishlist(prod.id) ? '#dc2626' : '#9ca3af'} fill={isInWishlist(prod.id) ? '#dc2626' : 'none'} />
                </button>

                {/* Product Image Clickable Link */}
                <Link
                  to={`/product/${prod.id}`}
                  style={{
                    height: '190px',
                    backgroundColor: '#faf8f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.85rem',
                    overflow: 'hidden',
                    borderBottom: '1px solid #f3e8eb',
                    textDecoration: 'none'
                  }}
                >
                  <img
                    src={prod.image}
                    alt={prod.nameEn}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => { e.target.style.transform = 'scale(1.06)'; }}
                    onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </Link>

                {/* Product Info */}
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#800020', fontWeight: '800', textTransform: 'uppercase' }}>
                      {prod.sku}
                    </span>
                    <Link to={`/product/${prod.id}`} style={{ textDecoration: 'none' }}>
                      <h4 style={{
                        fontSize: '0.98rem',
                        fontWeight: '800',
                        color: '#111827',
                        margin: '0.25rem 0 0.4rem',
                        lineHeight: '1.3'
                      }}>
                        {isRTL ? prod.nameAr : prod.nameEn}
                      </h4>
                    </Link>
                    <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '0 0 0.75rem', lineHeight: '1.4' }}>
                      {isRTL ? prod.descAr : prod.descEn}
                    </p>
                  </div>

                  {/* Price & Add to Cart */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f3e8eb', paddingTop: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', display: 'block' }}>
                        {isRTL ? 'السعر' : 'Price'}
                      </span>
                      <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#800020' }}>
                        OMR {prod.price.toFixed(3)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(prod)}
                      style={{
                        backgroundColor: addedItem === prod.id ? '#16a34a' : '#800020',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.5rem 0.85rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        boxShadow: '0 2px 6px rgba(128, 0, 32, 0.2)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {addedItem === prod.id ? (
                        <>
                          <Check size={14} />
                          <span>{isRTL ? 'تمت!' : 'Added!'}</span>
                        </>
                      ) : !isAuthenticated ? (
                        <>
                          <Lock size={14} />
                          <span>{isRTL ? 'شراء' : 'Buy'}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={14} />
                          <span>{isRTL ? 'أضف' : 'Add'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #ebdada' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>
                {isRTL ? 'لا توجد منتجات مطابقة لهذا القسم' : 'No products found in this category'}
              </p>
              <button
                onClick={() => setSearchParams({ category: 'all' })}
                style={{
                  marginTop: '0.85rem',
                  padding: '0.6rem 1.25rem',
                  backgroundColor: '#800020',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {isRTL ? 'عرض جميع المنتجات' : 'View All Products'}
              </button>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
