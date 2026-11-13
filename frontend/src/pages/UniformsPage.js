import React, { useState, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Filter, ChevronDown, Check, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { useLanguage } from '../context/LanguageContext.js';
import { useAuth } from '../context/AuthContext.js';

export default function UniformsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { t, isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [addedItem, setAddedItem] = useState(null);
  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const [sortBy, setSortBy] = useState('featured');

  // The 7 official school uniform items matching reference design exactly
  const allProducts = [
    {
      id: 1,
      category: 'uniforms',
      sku: 'UNIF-POLO-MRN',
      nameEn: 'Polo Shirt (Maroon)',
      nameAr: 'قميص بولو مدرسي (عنابي)',
      descEn: 'Official school polo shirt in durable cotton',
      descAr: 'قميص البولو المدرسي الرسمي بخامات قطنية عالية الجودة',
      price: 6.000,
      image: '/products/polo-shirt-front.jpg',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      defaultSize: 'M'
    },
    {
      id: 2,
      category: 'uniforms',
      subCategory: 'boys-trousers',
      sku: 'IPS-UNIF-TRSR-GRY',
      nameEn: "Boys' Trousers (Gray)",
      nameAr: 'بنطال رمادي رسمي للأولاد',
      descEn: 'Regular fit school trousers',
      descAr: 'بنطال مدرسي رمادي مريح للأولاد',
      price: 8.500,
      image: '/products/boys-gray-trousers.jpg',
      sizes: ['26', '28', '30', '32', '34', '36'],
      defaultSize: '30'
    },
    {
      id: 3,
      category: 'uniforms',
      subCategory: 'girls-skirts',
      sku: 'IPS-UNIF-SKRT-GRY',
      nameEn: "Girls' Skirt (Gray)",
      nameAr: 'تنورة رمادية بكسرات للبنات',
      descEn: 'Comfortable pleated school skirt',
      descAr: 'تنورة مدرسية مريحة بكسرات أنيقة وقماش متين',
      price: 8.000,
      image: '/products/girls-gray-skirt.jpg',
      sizes: ['26', '28', '30', '32', '34', '36'],
      defaultSize: '28'
    },
    {
      id: 4,
      category: 'shoes',
      sku: 'IPS-SHOE-BOY-BLK',
      nameEn: "Boys' School Shoes (Black)",
      nameAr: 'حذاء مدرسي أسود للأولاد',
      descEn: 'Durable and comfortable',
      descAr: 'حذاء جلدي متين ومريح للأولاد للمدرسة',
      price: 12.500,
      image: '/products/boys-black-shoes.jpg',
      sizes: ['32', '34', '36', '38', '40', '42'],
      defaultSize: '36'
    },
    {
      id: 5,
      category: 'shoes',
      sku: 'IPS-SHOE-GRL-BLK',
      nameEn: "Girls' Mary Jane Shoes (Black)",
      nameAr: 'حذاء ماري جين أسود للبنات',
      descEn: 'Classic and comfortable',
      descAr: 'حذاء كلاسيكي أنيق ومريح للبنات للمدرسة',
      price: 12.500,
      image: '/products/girls-black-shoes.jpg',
      sizes: ['30', '32', '34', '36', '38', '40'],
      defaultSize: '34'
    },
    {
      id: 6,
      category: 'accessories',
      sku: 'IPS-ACCS-BELT-BLK',
      nameEn: 'School Belt (Black)',
      nameAr: 'حزام مدرسي جلدي (أسود)',
      descEn: 'Adjustable and durable',
      descAr: 'حزام جلدي أسود قابل للتعديل ومتين',
      price: 2.500,
      image: '/products/school-belt-black.jpg',
      sizes: ['Standard'],
      defaultSize: 'Standard'
    },
    {
      id: 7,
      category: 'accessories',
      sku: 'IPS-ACCS-SOCK-WHT',
      nameEn: 'School Socks (White)',
      nameAr: 'جوارب مدرسية بيضاء (زوج)',
      descEn: 'Soft and long-lasting (Pair)',
      descAr: 'جوارب قطنية ناعمة ومتينة تدوم طويلاً',
      price: 1.000,
      image: '/products/school-socks-white.jpg',
      sizes: ['S (28-33)', 'M (34-38)', 'L (39-44)'],
      defaultSize: 'M (34-38)'
    },
    {
      id: 8,
      category: 'books',
      sku: 'IPS-BOOK-ENG-P1',
      nameEn: "Cambridge Primary English Learner's Book",
      nameAr: 'كتاب كامبريدج للغة الإنجليزية (الابتدائي)',
      descEn: 'Official Cambridge English curriculum learner book',
      descAr: 'كتاب الطالب لمنهاج كامبريدج المعتمد لمدرسة الرواد',
      price: 7.500,
      image: '/images/category-books.jpg',
      sizes: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6'],
      defaultSize: 'Stage 3'
    },
    {
      id: 9,
      category: 'books',
      sku: 'IPS-BOOK-MTH-P1',
      nameEn: "Cambridge Primary Mathematics Learner's Book",
      nameAr: 'كتاب كامبريدج للرياضيات (الابتدائي)',
      descEn: 'Official Cambridge Mathematics curriculum learner book',
      descAr: 'كتاب الرياضيات لمنهاج كامبريدج لمدرسة الرواد',
      price: 7.500,
      image: '/images/category-books.jpg',
      sizes: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6'],
      defaultSize: 'Stage 3'
    },
    {
      id: 10,
      category: 'stationery',
      sku: 'STAT-NOTE-5PK',
      nameEn: 'Spiral Notebooks (5-Pack)',
      nameAr: 'دفاتر سلك مدرسية (حزمة 5)',
      descEn: 'Premium 80gsm lined school notebooks',
      descAr: 'حزمة 5 دفاتر سلكية رسمية بورق ناعم عالي الجودة',
      price: 3.200,
      image: '/images/category-accessories.jpg',
      sizes: ['Single Line', 'Four Line', 'Grid'],
      defaultSize: 'Single Line'
    },
    {
      id: 11,
      category: 'stationery',
      sku: 'STAT-GEOM-SET',
      nameEn: 'Complete Geometry Set',
      nameAr: 'طقم هندسة وقرطاسية كامل 10 قطع',
      descEn: 'Complete 10-piece mathematical geometry tin set',
      descAr: 'طقم أدوات هندسية متكامل في علبة معدنية متينة',
      price: 2.500,
      image: '/images/category-accessories.jpg',
      sizes: ['10-Piece Kit'],
      defaultSize: '10-Piece Kit'
    },
    {
      id: 12,
      category: 'stationery',
      subCategory: 'school-bags',
      sku: 'BAG-MRN-01',
      nameEn: 'School Backpack (Maroon)',
      nameAr: 'حقيبة مدرسية طبية مريحة (عنابي)',
      descEn: 'Ergonomic spine-support school bag',
      descAr: 'حقيبة مدرسية طبية مريحة مع دعم للظهر',
      price: 14.500,
      image: '/images/cat-bags.jpg',
      sizes: ['Junior (Grades 1-4)', 'Senior (Grades 5-12)'],
      defaultSize: 'Senior (Grades 5-12)'
    },
    {
      id: 13,
      category: 'lunch-boxes',
      sku: 'LUNCH-BOX-SET',
      nameEn: 'Insulated Lunch Box & Water Bottle Set',
      nameAr: 'حافظة طعام ومطارة ماء عازلة للحرارة',
      descEn: 'BPA-free leakproof lunch container with stainless steel bottle',
      descAr: 'حافظة طعام مانعة للتسرب خالية من مادة BPA مع مطارة ماء ستانلس ستيل',
      price: 5.500,
      image: '/images/cat-lunchbox.jpg',
      sizes: ['Standard (750ml)', 'Large (1000ml)'],
      defaultSize: 'Standard (750ml)'
    },
    {
      id: 14,
      category: 'electronics',
      sku: 'ELEC-CALC-SET',
      nameEn: 'Scientific Calculator & Digital Stylus',
      nameAr: 'آلة حاسبة علمية وقلم لمس رقمي',
      descEn: 'High-precision scientific calculator approved for school exams',
      descAr: 'آلة حاسبة علمية دقيقة ومعتمدة للاختبارات والمناهج المدرسية',
      price: 8.500,
      image: '/images/cat-electronics.jpg',
      sizes: ['Standard Model'],
      defaultSize: 'Standard Model'
    },
    {
      id: 15,
      category: 'fitness-sports',
      sku: 'SPRT-TRAIN-SET',
      nameEn: 'Athletics Training Shoes & Sport Bag',
      nameAr: 'حذاء رياضي تدريبي وحقيبة رياضية',
      descEn: 'Cushioned breathable athletic sports shoes with gym bag',
      descAr: 'حذاء تدريب رياضي مبطن وخفيف الوزن مع حقيبة رياضية',
      price: 11.500,
      image: '/images/cat-sports.jpg',
      sizes: ['32', '34', '36', '38', '40', '42'],
      defaultSize: '36'
    },
    {
      id: 16,
      category: 'travel-outdoor',
      sku: 'TRVL-BAG-DUF',
      nameEn: 'Multi-Pocket Travel & Outdoor Duffel',
      nameAr: 'حقيبة سفر ورحلات خارجية متعددة الجيوب',
      descEn: 'Waterproof durable travel luggage bag with shoulder strap',
      descAr: 'حقيبة سفر مقاومة للماء ومتينة مع حزام كتف مريح',
      price: 13.000,
      image: '/images/cat-travel.jpg',
      sizes: ['Medium (35L)', 'Large (50L)'],
      defaultSize: 'Medium (35L)'
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
          (selectedCategory === 'school-uniforms' && (product.category === 'uniforms' || product.category === 'school-uniforms')) ||
          (selectedCategory === 'uniforms' && (product.category === 'uniforms' || product.category === 'school-uniforms')) ||
          (selectedCategory === 'boys-trousers' && (product.subCategory === 'boys-trousers' || product.category === 'trousers')) ||
          (selectedCategory === 'trousers' && (product.subCategory === 'boys-trousers' || product.category === 'trousers')) ||
          (selectedCategory === 'girls-skirts' && (product.subCategory === 'girls-skirts' || product.category === 'skirts')) ||
          (selectedCategory === 'skirts' && (product.subCategory === 'girls-skirts' || product.category === 'skirts')) ||
          (selectedCategory === 'shoes' && product.category === 'shoes') ||
          (selectedCategory === 'accessories' && product.category === 'accessories') ||
          (selectedCategory === 'stationery-books' && (product.category === 'books' || product.category === 'stationery')) ||
          (selectedCategory === 'books-stationery' && (product.category === 'books' || product.category === 'stationery')) ||
          (selectedCategory === 'books' && product.category === 'books') ||
          (selectedCategory === 'stationery' && product.category === 'stationery') ||
          (selectedCategory === 'school-bags' && (product.category === 'school-bags' || product.subCategory === 'school-bags' || product.id === 12)) ||
          (selectedCategory === 'lunch-boxes' && (product.category === 'lunch-boxes' || product.category === 'lunch-drinkware')) ||
          (selectedCategory === 'lunch-drinkware' && (product.category === 'lunch-boxes' || product.category === 'lunch-drinkware')) ||
          (selectedCategory === 'electronics' && (product.category === 'electronics' || product.category === 'electronics-mobile')) ||
          (selectedCategory === 'electronics-mobile' && (product.category === 'electronics' || product.category === 'electronics-mobile')) ||
          (selectedCategory === 'fitness-sports' && (product.category === 'fitness-sports' || product.category === 'sports')) ||
          (selectedCategory === 'travel-outdoor' && (product.category === 'travel-outdoor' || product.category === 'travel'));
        if (!matchesCategory) return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matches =
          product.nameEn.toLowerCase().includes(query) ||
          product.nameAr.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query);
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

  const categoriesList = [
    { id: 'all', label: isRTL ? 'جميع الأقسام' : 'All Categories', count: 16, image: '/products/polo-shirt-front.jpg' },
    { id: 'school-uniforms', label: isRTL ? 'الزي المدرسي' : 'School Uniforms', count: 3, image: '/products/polo-shirt-front.jpg' },
    { id: 'boys-trousers', label: isRTL ? 'بناطيل الأولاد' : "Boys' Trousers", count: 1, image: '/products/boys-gray-trousers.jpg' },
    { id: 'girls-skirts', label: isRTL ? 'تنانير البنات' : "Girls' Skirts", count: 1, image: '/products/girls-gray-skirt.jpg' },
    { id: 'shoes', label: isRTL ? 'الأحذية المدرسية' : 'School Shoes', count: 2, image: '/products/boys-black-shoes.jpg' },
    { id: 'accessories', label: isRTL ? 'الإكسسوارات والجوارب' : 'Accessories & Socks', count: 2, image: '/images/cat-accessories.jpg' },
    { id: 'stationery-books', label: isRTL ? 'الكتب والقرطاسية' : 'Books & Stationery', count: 4, image: '/images/cat-books.jpg' },
    { id: 'school-bags', label: isRTL ? 'الحقائب المدرسية' : 'School Bags', count: 1, image: '/images/cat-bags.jpg' },
    { id: 'lunch-boxes', label: isRTL ? 'حافظات وعلب الطعام' : 'Lunch Boxes & Drinkware', count: 1, image: '/images/cat-lunchbox.jpg' },
    { id: 'electronics', label: isRTL ? 'الإلكترونيات والآلات' : 'Electronics & Tech', count: 1, image: '/images/cat-electronics.jpg' },
    { id: 'fitness-sports', label: isRTL ? 'اللياقة والرياضة' : 'Fitness & Sports', count: 1, image: '/images/cat-sports.jpg' },
    { id: 'travel-outdoor', label: isRTL ? 'السفر والرحلات' : 'Travel & Outdoor', count: 1, image: '/images/cat-travel.jpg' }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Sidebar matching Reference Screenshot 2 */}
        <aside className="hide-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Shop Brand Box - No Logo */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '42px', height: '42px', backgroundColor: '#800020', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <ShoppingCart size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#800020', margin: 0, lineHeight: 1.2 }}>
                  {isRTL ? 'المتجر' : 'Shop'}
                </h3>
                <p style={{ fontSize: '0.74rem', color: '#6b7280', margin: '2px 0 0' }}>
                  {isRTL ? 'المتجر الإلكتروني المعتمد' : 'Official Online Store'}
                </p>
              </div>
            </div>
          </div>

          {/* Categories Nav */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#111827', margin: '0 0 1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
              {isRTL ? 'الفئات والأقسام' : 'Shop Categories'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSearchParams(cat.id === 'all' ? {} : { category: cat.id })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '10px',
                    fontSize: '0.84rem',
                    fontWeight: selectedCategory === cat.id ? '700' : '500',
                    backgroundColor: selectedCategory === cat.id ? '#fdf2f4' : '#ffffff',
                    color: selectedCategory === cat.id ? '#800020' : '#374151',
                    border: selectedCategory === cat.id ? '1.5px solid #800020' : '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    textAlign: isRTL ? 'right' : 'left',
                    boxShadow: selectedCategory === cat.id ? '0 2px 8px rgba(128,0,32,0.08)' : 'none'
                  }}
                >
                  {/* Landscape Category Thumbnail */}
                  <div style={{
                    width: '46px',
                    height: '32px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    backgroundColor: '#fbf9fa',
                    border: '1px solid #ebdada',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <img
                      src={cat.image}
                      alt={cat.label}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '2px'
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: '1.25'
                    }}>
                      {cat.label}
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.74rem',
                    color: selectedCategory === cat.id ? '#800020' : '#9ca3af',
                    fontWeight: '700',
                    padding: '0.15rem 0.4rem',
                    backgroundColor: selectedCategory === cat.id ? 'rgba(128,0,32,0.1)' : '#f3f4f6',
                    borderRadius: '6px'
                  }}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Clean Quality & Payment Card - No Logo */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb', backgroundColor: '#fdf8f9', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#800020', marginBottom: '0.4rem' }}>
              {isRTL ? 'طرق دفع معتمدة' : 'Accepted Payments'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#4b5563', lineHeight: '1.5' }}>
              {isRTL ? '• بطاقة بنكية (خصم / ائتمان)\n• الدفع نقداً عند الاستلام' : '• Debit / Credit Card\n• Cash on Delivery (COD)'}
            </div>
          </div>

        </aside>

        {/* Right Product Grid matching Reference Screenshot 2 */}
        <main>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
            <div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                {isRTL ? 'كتالوج المنتجات والأقسام' : 'Official Product Catalog'}
              </h1>
              <p style={{ fontSize: '0.86rem', color: '#6b7280', margin: '4px 0 0' }}>
                {isRTL
                  ? 'تسوق تشكيلة متكاملة من الملابس، الحقائب، القرطاسية والمستلزمات بأعلى معايير الجودة.'
                  : 'Shop a curated collection across school essentials, clothing, accessories, and supplies.'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.84rem', backgroundColor: '#fff', cursor: 'pointer' }}
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {/* Wishlist Heart Icon */}
                <button
                  onClick={() => toggleWishlist(product)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    zIndex: 10,
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: isInWishlist(product.id) ? '#dc2626' : '#9ca3af',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  <Heart size={16} fill={isInWishlist(product.id) ? '#dc2626' : 'none'} />
                </button>

                {/* Product Image on Clean White Background */}
                <Link to={`/product/${product.id}`} style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: '#ffffff' }}>
                  <img
                    src={product.image}
                    alt={product.nameEn}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                  />
                </Link>

                {/* Product Info */}
                <div style={{ padding: '1rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#111827', margin: '0 0 4px', lineHeight: 1.3 }}>
                      {isRTL ? product.nameAr : product.nameEn}
                    </h3>
                  </Link>

                  <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '0 0 10px', lineHeight: 1.35 }}>
                    {isRTL ? product.descAr : product.descEn}
                  </p>

                  {/* Available Sizes Badge preview */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: '600' }}>
                      {isRTL ? 'المقاسات:' : 'Sizes:'}
                    </span>
                    {product.sizes.slice(0, 4).map(sz => (
                      <span key={sz} style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', backgroundColor: '#f3f4f6', borderRadius: '4px', color: '#374151', fontWeight: '600' }}>
                        {sz}
                      </span>
                    ))}
                    {product.sizes.length > 4 && (
                      <span style={{ fontSize: '0.7rem', color: '#800020', fontWeight: '700' }}>
                        +{product.sizes.length - 4}
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#800020', marginBottom: '0.85rem', marginTop: 'auto' }}>
                    OMR {product.price.toFixed(3)}
                  </div>

                  {/* Actions Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
                    <Link
                      to={`/product/${product.id}`}
                      className="btn-primary"
                      style={{
                        padding: '0.65rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.84rem',
                        fontWeight: '700',
                        textDecoration: 'none',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        backgroundColor: '#800020'
                      }}
                    >
                      <span>{isRTL ? 'اختيار المقاس' : 'Select Size'}</span>
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      title={isAuthenticated ? 'Quick Add' : (isRTL ? 'تسجيل الدخول مطلوب للشراء' : 'Login Required to Buy')}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        backgroundColor: addedItem === product.id ? '#16a34a' : (!isAuthenticated ? '#fdf2f4' : '#ffffff'),
                        color: addedItem === product.id ? '#ffffff' : '#800020',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {addedItem === product.id ? (
                        <Check size={18} />
                      ) : !isAuthenticated ? (
                        <Lock size={16} />
                      ) : (
                        <ShoppingCart size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </main>

      </div>
    </div>
  );
}

