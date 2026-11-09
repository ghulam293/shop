import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Star,
  CheckCircle,
  Truck,
  ShieldCheck,
  RefreshCw,
  Lock,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { useLanguage } from '../context/LanguageContext.js';
import { useAuth } from '../context/AuthContext.js';

// All official school uniform products with their genuine size matrices
export const officialProductsList = [
  {
    id: 1,
    sku: 'IPS-UNIF-POLO-MRN',
    nameEn: 'IPS School Polo Shirt',
    nameAr: 'قميص بولو مدرسة الرواد (عنابي)',
    subtitleEn: 'Official School Uniform — Maroon Polo Shirt',
    subtitleAr: 'الزي المدرسي الرسمي — قميص بولو عنابي',
    category: 'Uniforms',
    categorySlug: 'uniforms',
    price: 6.500,
    rating: 5.0,
    reviewsCount: 128,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    sizeLabel: 'Shirt Size',
    defaultSize: 'M',
    images: [
      '/products/polo-shirt-front.jpg',
      '/products/polo-shirt-back.jpg',
      '/products/polo-collar-detail.jpg',
      '/products/polo-fabric-detail.jpg'
    ],
    descEn: 'Official International Pioneers School uniform polo shirt. Breathable, durable cotton-blend pique featuring official school crest and contrast gold-trimmed collar and cuffs.',
    descAr: 'قميص البولو الرسمي لمدرسة الرواد الدولية بصلالة. مصنوع من أجود خامات القطن المريحة مع شعار المدرسة الرسمي وياقة أنيقة بأطراف ذهبية.'
  },
  {
    id: 2,
    sku: 'IPS-UNIF-TRSR-GRY',
    nameEn: "Boys' Gray Trousers",
    nameAr: 'بنطال أولاد رمادي رسمي',
    subtitleEn: 'Official School Uniform — Regular Fit Trousers',
    subtitleAr: 'الزي المدرسي الرسمي — بنطال رمادي مريح للأولاد',
    category: "Boys' Trousers",
    categorySlug: 'boys-trousers',
    price: 8.500,
    rating: 4.9,
    reviewsCount: 94,
    sizes: ['26', '28', '30', '32', '34', '36'],
    sizeLabel: 'Waist Size (Inches)',
    defaultSize: '30',
    images: [
      '/products/boys-gray-trousers.jpg'
    ],
    descEn: 'Official tailored gray school trousers for boys. Wrinkle-resistant fabric with adjustable inner waistband for maximum comfort throughout the school day.',
    descAr: 'بنطال مدرسي رمادي مريح للأولاد، مقاوم للتجاعيد مع حزام خصر داخلي قابل للتعديل لتوفير أقصى درجات الراحة اليومية.'
  },
  {
    id: 3,
    sku: 'IPS-UNIF-SKRT-GRY',
    nameEn: "Girls' Gray Pleated Skirt",
    nameAr: 'تنورة بنات رمادية بكسرات',
    subtitleEn: 'Official School Uniform — Pleated Skirt',
    subtitleAr: 'الزي المدرسي الرسمي — تنورة بكسرات أنيقة للبنات',
    category: "Girls' Skirts",
    categorySlug: 'girls-skirts',
    price: 8.000,
    rating: 5.0,
    reviewsCount: 112,
    sizes: ['26', '28', '30', '32', '34', '36'],
    sizeLabel: 'Waist Size (Inches)',
    defaultSize: '28',
    images: [
      '/products/girls-gray-skirt.jpg'
    ],
    descEn: 'Official gray knife-pleated school skirt for girls featuring discrete embroidered IPS monogram, elasticated comfort waist, and durable school-grade twill.',
    descAr: 'تنورة مدرسية رمادية أنيقة بكسرات وتطريز شعار IPS مع خصر مرن مريح وقماش عالي الجودة يدوم طويلاً.'
  },
  {
    id: 4,
    sku: 'IPS-SHOE-BOY-BLK',
    nameEn: "Boys' Black School Shoes",
    nameAr: 'حذاء مدرسي أسود للأولاد',
    subtitleEn: 'Official School Uniform — Leather Lace-up Shoes',
    subtitleAr: 'الزي المدرسي الرسمي — حذاء جلدي برباط للأولاد',
    category: 'School Shoes',
    categorySlug: 'shoes',
    price: 12.500,
    rating: 4.8,
    reviewsCount: 86,
    sizes: ['32', '34', '36', '38', '40', '42'],
    sizeLabel: 'Shoe Size (EU)',
    defaultSize: '36',
    images: [
      '/products/boys-black-shoes.jpg'
    ],
    descEn: 'Genuine leather lace-up school shoes for boys. Cushioned insole, non-marking rubber outsole, and scuff-resistant toe cap designed for active school routines.',
    descAr: 'حذاء مدرسي رسمي للأولاد مصنوع من الجلد الطبيعي برباط، مزود بنعل داخلي مبطن ومقاوم للانزلاق لضمان الراحة طوال اليوم.'
  },
  {
    id: 5,
    sku: 'IPS-SHOE-GRL-BLK',
    nameEn: "Girls' Mary Jane Shoes (Black)",
    nameAr: 'حذاء ماري جين أسود للبنات',
    subtitleEn: 'Official School Uniform — Mary Jane Buckle Shoes',
    subtitleAr: 'الزي المدرسي الرسمي — حذاء ماري جين كلاسيكي للبنات',
    category: 'School Shoes',
    categorySlug: 'shoes',
    price: 12.500,
    rating: 4.9,
    reviewsCount: 79,
    sizes: ['30', '32', '34', '36', '38', '40'],
    sizeLabel: 'Shoe Size (EU)',
    defaultSize: '34',
    images: [
      '/products/girls-black-shoes.jpg'
    ],
    descEn: 'Classic school Mary Jane shoes for girls with secure hook-and-loop strap, supportive arch support, and sleek glossy finish.',
    descAr: 'حذاء ماري جين الكلاسيكي للبنات بحزام إغلاق عملي وقوس داعم للقدم مع مظهر أنيق ومريح للمدرسة.'
  },
  {
    id: 6,
    sku: 'IPS-ACCS-BELT-BLK',
    nameEn: 'School Belt (Black)',
    nameAr: 'حزام مدرسي جلدي (أسود)',
    subtitleEn: 'Official School Uniform — Adjustable Leather Belt',
    subtitleAr: 'الزي المدرسي الرسمي — حزام جلدي أسود بإبزيم فضي',
    category: 'Accessories',
    categorySlug: 'accessories',
    price: 2.500,
    rating: 4.8,
    reviewsCount: 65,
    sizes: ['Standard (Adjustable)'],
    sizeLabel: 'Belt Size',
    defaultSize: 'Standard (Adjustable)',
    images: [
      '/products/school-belt-black.jpg'
    ],
    descEn: 'Sturdy black synthetic leather school belt with classic silver-finish buckle and multiple adjustment holes.',
    descAr: 'حزام مدرسي رسمي أنيق باللون الأسود مزود بإبزيم فضي كلاسيكي متين ومناسب لجميع المقاسات.'
  },
  {
    id: 7,
    sku: 'IPS-ACCS-SOCK-WHT',
    nameEn: 'School Socks (White)',
    nameAr: 'جوارب مدرسية بيضاء (زوج)',
    subtitleEn: 'Official School Uniform — Cotton Crew Socks',
    subtitleAr: 'الزي المدرسي الرسمي — جوارب قطنية بيضاء متينة',
    category: 'Accessories',
    categorySlug: 'accessories',
    price: 1.000,
    rating: 4.9,
    reviewsCount: 140,
    sizes: ['S (Shoe 28-33)', 'M (Shoe 34-38)', 'L (Shoe 39-44)'],
    sizeLabel: 'Sock Size',
    defaultSize: 'M (Shoe 34-38)',
    images: [
      '/products/school-socks-white.jpg'
    ],
    descEn: 'Pack of soft, high-cotton white crew socks with reinforced heel and toe for durability and breathability.',
    descAr: 'جوارب قطنية بيضاء ناعمة ومريحة للمدرسة مع كعب ومشط معزز لمتانة تدوم مع كثرة الغسيل.'
  },
  {
    id: 8,
    sku: 'IPS-BOOK-ENG-P1',
    nameEn: "Cambridge Primary English Learner's Book",
    nameAr: 'كتاب كامبريدج للغة الإنجليزية للمرحلة الابتدائية',
    subtitleEn: 'Official IPS Curriculum — Cambridge Primary English',
    subtitleAr: 'المنهاج الرسمي لمدرسة الرواد — كامبريدج الابتدائية',
    category: 'School Books',
    categorySlug: 'books',
    price: 7.500,
    rating: 5.0,
    reviewsCount: 88,
    sizes: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6'],
    sizeLabel: 'Curriculum Stage',
    defaultSize: 'Stage 3',
    images: ['/images/category-books.jpg'],
    descEn: 'Official Cambridge Primary English Learner Book approved for International Pioneers School curriculum.',
    descAr: 'كتاب الطالب المعتمد لمنهاج كامبريدج للغة الإنجليزية لمدرسة الرواد الدولية.'
  },
  {
    id: 9,
    sku: 'IPS-BOOK-MTH-P1',
    nameEn: "Cambridge Primary Mathematics Learner's Book",
    nameAr: 'كتاب كامبريدج للرياضيات للمرحلة الابتدائية',
    subtitleEn: 'Official IPS Curriculum — Cambridge Primary Mathematics',
    subtitleAr: 'المنهاج الرسمي لمدرسة الرواد — كامبريدج للرياضيات',
    category: 'School Books',
    categorySlug: 'books',
    price: 7.500,
    rating: 4.9,
    reviewsCount: 76,
    sizes: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6'],
    sizeLabel: 'Curriculum Stage',
    defaultSize: 'Stage 3',
    images: ['/images/category-books.jpg'],
    descEn: 'Official Cambridge Primary Mathematics Learner Book for IPS students.',
    descAr: 'كتاب كامبريدج المعتمد للرياضيات لمدرسة الرواد الدولية بصلالة.'
  },
  {
    id: 10,
    sku: 'IPS-STAT-NOTE-5PK',
    nameEn: 'IPS Premium Spiral Notebooks (5-Pack)',
    nameAr: 'دفاتر سلك مدرسية بشعار المدرسة (حزمة 5 دفاتر)',
    subtitleEn: 'Official IPS Stationery — 80gsm Premium Lined Paper',
    subtitleAr: 'القرطاسية المدرسية الرسمية — ورق عالي الجودة 80 جرام',
    category: 'Stationery',
    categorySlug: 'stationery',
    price: 3.200,
    rating: 4.8,
    reviewsCount: 110,
    sizes: ['Single Line (English)', 'Four Line (Writing)', 'Arabic Lined', 'Grid / Math'],
    sizeLabel: 'Ruling Type',
    defaultSize: 'Single Line (English)',
    images: ['/images/category-accessories.jpg'],
    descEn: 'Pack of 5 high-grade school notebooks branded with IPS crest. Features 80gsm smooth paper.',
    descAr: 'حزمة 5 دفاتر سلكية رسمية بشعار مدرسة الرواد الدولية، ورق ناعم عالي الجودة مناسب لجميع المواد.'
  },
  {
    id: 11,
    sku: 'IPS-STAT-GEOM-SET',
    nameEn: 'IPS Complete Geometry & Stationery Set',
    nameAr: 'طقم هندسة وقرطاسية كامل بشعار المدرسة',
    subtitleEn: 'Complete 10-Piece Mathematical & Geometry Kit',
    subtitleAr: 'طقم أدوات هندسية متكامل 10 قطع في علبة معدنية متينة',
    category: 'Stationery',
    categorySlug: 'stationery',
    price: 2.500,
    rating: 4.9,
    reviewsCount: 95,
    sizes: ['Standard 10-Piece Metal Box'],
    sizeLabel: 'Kit Type',
    defaultSize: 'Standard 10-Piece Metal Box',
    images: ['/images/category-accessories.jpg'],
    descEn: 'Durable metal tin containing compass, dividers, 15cm ruler, 45 & 60 degree set squares, protractor, pencil, eraser, and sharpener.',
    descAr: 'طقم هندسي متكامل بعلبة معدنية متينة يحتوي على فرجار، مسطرة، منقلة، مثلثات، قلم رصاص وممحاة.'
  },
  {
    id: 12,
    sku: 'IPS-BAG-MRN-01',
    nameEn: 'IPS Ergonomic School Backpack (Maroon)',
    nameAr: 'حقيبة مدرسية طبية مريحة بشعار المدرسة (عنابي)',
    subtitleEn: 'Ergonomic Spine-Support School Backpack with IPS Crest',
    subtitleAr: 'حقيبة مدرسية طبية مع دعم للعمود الفقري وتطريز شعار المدرسة',
    category: 'Stationery',
    categorySlug: 'stationery',
    price: 14.500,
    rating: 5.0,
    reviewsCount: 132,
    sizes: ['Junior (Grades 1-4)', 'Senior (Grades 5-12)'],
    sizeLabel: 'Backpack Size',
    defaultSize: 'Senior (Grades 5-12)',
    images: ['/images/category-books.jpg'],
    descEn: 'Official IPS maroon backpack with ergonomic orthopedic back padding, reflective safety strips, water-repellent fabric, and heavy-duty zippers.',
    descAr: 'حقيبة مدرسة الرواد الرسمية باللون العنابي، تصميم مريح للظهر مزودة بشرائط عاكسة وأقمشة مقاومة للماء.'
  }
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { t, isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Find the exact product clicked
  const productId = parseInt(id, 10) || 1;
  const product = useMemo(() => {
    return officialProductsList.find(p => p.id === productId) || officialProductsList[0];
  }, [productId]);

  const [selectedSize, setSelectedSize] = useState(product.defaultSize);
  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [added, setAdded] = useState(false);

  // Update selected size and reset thumbnail when navigating between products
  useEffect(() => {
    setSelectedSize(product.defaultSize);
    setActiveThumb(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  // Recommended items excluding current product
  const recommendedItems = useMemo(() => {
    return officialProductsList.filter(p => p.id !== product.id).slice(0, 6);
  }, [product.id]);

  const handleAddCurrent = () => {
    addToCart(
      {
        id: product.id,
        sku: product.sku,
        name_en: product.nameEn,
        name_ar: product.nameAr,
        base_price: product.price,
        image: product.images[0]
      },
      selectedSize,
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem clamp(1rem, 2vw, 2rem) 4rem' }}>
      
      {/* Dynamic Breadcrumb */}
      <div style={{ fontSize: '0.84rem', color: '#6b7280', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: '#6b7280' }}>{t('home')}</Link>
        <span>&gt;</span>
        <Link to="/uniforms" style={{ color: '#6b7280' }}>{t('uniforms')}</Link>
        <span>&gt;</span>
        <span style={{ color: '#111827', fontWeight: '700' }}>
          {isRTL ? product.nameAr : product.nameEn}
        </span>
      </div>

      {/* Main Product Showcase matching Mockup 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', marginBottom: '4rem', alignItems: 'start' }}>
        
        {/* Left: Thumbnail Column + Large Image */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          
          {/* Thumbnails (if multiple images exist) */}
          {product.images.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveThumb(idx)}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '10px',
                    border: activeThumb === idx ? '2px solid #800020' : '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    padding: '4px',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'border-color 0.15s'
                  }}
                >
                  <img
                    src={img}
                    alt="thumbnail"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image Container */}
          <div style={{
            flex: 1,
            minWidth: '280px',
            maxWidth: '480px',
            aspectRatio: '1 / 1',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <img
              src={product.images[activeThumb] || product.images[0]}
              alt={product.nameEn}
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
          </div>

        </div>

        {/* Right: Product Details, SIZES, and Actions */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          <h1 style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2.15rem)', fontWeight: '800', color: '#111827', margin: '0 0 0.35rem', lineHeight: 1.2 }}>
            {isRTL ? product.nameAr : product.nameEn}
          </h1>

          <p style={{ fontSize: '0.95rem', color: '#6b7280', margin: '0 0 1rem' }}>
            {isRTL ? product.subtitleAr : product.subtitleEn}
          </p>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#f59e0b" />
              ))}
            </div>
            <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>({product.reviewsCount} Reviews)</span>
          </div>

          {/* Price & Stock Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.15rem)', fontWeight: '800', color: '#800020' }}>
              OMR {product.price.toFixed(3)}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '700' }}>
              <CheckCircle size={15} />
              <span>In Stock (Salalah Campus)</span>
            </span>
          </div>

          {/* Product Description */}
          <p style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: '1.6', marginBottom: '1.75rem' }}>
            {isRTL ? product.descAr : product.descEn}
          </p>

          {/* ACCURATE SIZES FOR THIS PRODUCT */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#111827' }}>
                {product.sizeLabel}:
              </span>
              <span style={{ fontSize: '0.78rem', color: '#800020', fontWeight: '600' }}>
                Selected: {selectedSize}
              </span>
            </div>
            
            {/* Size Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  style={{
                    padding: '0.55rem 1.15rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    border: selectedSize === sz ? '2px solid #800020' : '1px solid #d1d5db',
                    backgroundColor: selectedSize === sz ? '#800020' : '#ffffff',
                    color: selectedSize === sz ? '#ffffff' : '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#111827' }}>Quantity:</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '0.45rem 0.85rem', backgroundColor: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
              >
                -
              </button>
              <span style={{ padding: '0.45rem 1.15rem', fontWeight: '700', fontSize: '0.95rem' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: '0.45rem 0.85rem', backgroundColor: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
              >
                +
              </button>
            </div>
          </div>

          {/* Login Required Notice */}
          {!isAuthenticated && (
            <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', color: '#92400e', fontSize: '0.86rem' }}>
              <Lock size={16} style={{ color: '#b45309', flexShrink: 0 }} />
              <span>
                {isRTL
                  ? 'شراء الزي والمستلزمات المدرسية يتطلب تسجيل الدخول.'
                  : 'Purchasing school items requires login.'}
              </span>
              <Link
                to="/login"
                state={{ from: { pathname: `/product/${product.id}` }, message: isRTL ? 'يرجى تسجيل الدخول أولاً لإتمام الشراء والطلب.' : 'Please log in to purchase and place an order.' }}
                style={{ color: '#800020', fontWeight: '700', textDecoration: 'underline', marginInlineStart: 'auto' }}
              >
                {isRTL ? 'تسجيل الدخول' : 'Login'}
              </Link>
            </div>
          )}

          {/* Action Buttons: Add to Cart & Wishlist */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {isAuthenticated ? (
              <button
                onClick={handleAddCurrent}
                className="btn-primary"
                style={{ flex: 1, minWidth: '180px', padding: '0.85rem 1.5rem', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', backgroundColor: added ? '#16a34a' : '#800020' }}
              >
                <ShoppingCart size={19} />
                <span>{added ? (isRTL ? 'تمت الإضافة للسلة!' : 'Added to Cart!') : (isRTL ? `إضافة إلى السلة • ${(product.price * quantity).toFixed(3)} ر.ع` : `Add to Cart • OMR ${(product.price * quantity).toFixed(3)}`)}</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/login', { state: { from: { pathname: `/product/${product.id}` }, message: isRTL ? 'يرجى تسجيل الدخول أولاً لإتمام الشراء والطلب.' : 'Please log in to purchase and place an order.' } })}
                className="btn-primary"
                style={{ flex: 1, minWidth: '220px', padding: '0.85rem 1.5rem', borderRadius: '8px', fontSize: '0.96rem', fontWeight: '700', backgroundColor: '#800020' }}
              >
                <Lock size={18} />
                <span>{isRTL ? 'تسجيل الدخول مطلوب للشراء' : 'Login Required to Buy'}</span>
              </button>
            )}

            <button
              onClick={() => toggleWishlist(product)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                backgroundColor: '#ffffff',
                color: isInWishlist(product.id) ? '#dc2626' : '#374151',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Heart size={18} fill={isInWishlist(product.id) ? '#dc2626' : 'none'} />
              <span>{isInWishlist(product.id) ? (isRTL ? 'في المفضلة' : 'Saved in Wishlist') : (isRTL ? 'إضافة للمفضلة' : 'Add to Wishlist')}</span>
            </button>
          </div>

          {/* Trust Feature Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', borderTop: '1px solid #f3f4f6', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.74rem', color: '#4b5563' }}>
              <ShieldCheck size={18} style={{ color: '#800020', flexShrink: 0 }} />
              <span>School Approved Uniform</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.74rem', color: '#4b5563' }}>
              <CheckCircle size={18} style={{ color: '#800020', flexShrink: 0 }} />
              <span>Quality Fabric & Durable</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.74rem', color: '#4b5563' }}>
              <RefreshCw size={18} style={{ color: '#800020', flexShrink: 0 }} />
              <span>Easy Size Exchange</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.74rem', color: '#4b5563' }}>
              <Lock size={18} style={{ color: '#800020', flexShrink: 0 }} />
              <span>Secure School Shopping</span>
            </div>
          </div>

        </div>

      </div>

      {/* Recommended with This Item Section matching Mockup 1 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <span style={{ width: '5px', height: '22px', backgroundColor: '#800020', borderRadius: '3px' }} />
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#111827', margin: 0 }}>
            {isRTL ? 'منتجات موصى بها مع هذا المنتج' : 'Recommended with This Item'}
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1rem' }}>
          {recommendedItems.map((rec) => (
            <div
              key={rec.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              <button
                onClick={() => toggleWishlist(rec)}
                style={{ position: 'absolute', top: '8px', right: '8px', border: 'none', background: 'none', color: isInWishlist(rec.id) ? '#dc2626' : '#9ca3af', cursor: 'pointer', zIndex: 5 }}
              >
                <Heart size={15} fill={isInWishlist(rec.id) ? '#dc2626' : 'none'} />
              </button>

              <Link to={`/product/${rec.id}`} style={{ height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <img
                  src={rec.images[0]}
                  alt={rec.nameEn}
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
              </Link>

              <Link to={`/product/${rec.id}`} style={{ textDecoration: 'none' }}>
                <h4 style={{ fontSize: '0.84rem', fontWeight: '700', color: '#111827', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isRTL ? rec.nameAr : rec.nameEn}
                </h4>
              </Link>

              <div style={{ fontSize: '0.98rem', fontWeight: '800', color: '#800020', marginBottom: '0.75rem' }}>
                OMR {rec.price.toFixed(3)}
              </div>

              <button
                onClick={() => addToCart({ id: rec.id, sku: rec.sku, name_en: rec.nameEn, base_price: rec.price, image: rec.images[0] }, rec.defaultSize, 1)}
                className="btn-primary"
                style={{ width: '100%', padding: '0.45rem', fontSize: '0.78rem', borderRadius: '6px', fontWeight: '700', marginTop: 'auto' }}
              >
                <ShoppingCart size={13} />
                <span>Add to Cart</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
