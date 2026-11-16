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
  User,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { useLanguage } from '../context/LanguageContext.js';
import { useAuth } from '../context/AuthContext.js';
import { getCatalogProducts } from '../services/productStore.js';

// All store catalog products with genuine size matrices
export const officialProductsList = [
  {
    id: 1,
    sku: 'UNIF-POLO-MRN',
    nameEn: 'Classic Polo Shirt (Maroon)',
    nameAr: 'قميص بولو كلاسيكي (عنابي)',
    subtitleEn: 'Premium Cotton — Maroon Polo Shirt',
    subtitleAr: 'التشكيلة الراقية — قميص بولو عنابي',
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
    descEn: 'Premium cotton-blend pique polo shirt with breathable fabric, contrast gold-trimmed collar, and reinforced cuffs for all-day comfort.',
    descAr: 'قميص بولو قطني راقي ومريح، مصنوع من أجود خامات القطن مع تطريز أنيق وياقة بأطراف مذهبة فاخرة.'
  },
  {
    id: 2,
    sku: 'UNIF-TRSR-GRY',
    nameEn: "Boys' Formal Trousers (Gray)",
    nameAr: 'بنطال أولاد رمادي رسمي',
    subtitleEn: 'Regular Fit — Formal Gray Trousers',
    subtitleAr: 'التشكيلة الراقية — بنطال رمادي مريح للأولاد',
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
    descEn: 'Tailored gray trousers for boys. Wrinkle-resistant fabric with adjustable inner waistband for maximum all-day comfort.',
    descAr: 'بنطال رمادي أنيق ومريح للأولاد، مقاوم للتجاعيد مع حزام خصر داخلي قابل للتعديل لتوفير أقصى درجات الراحة.'
  },
  {
    id: 3,
    sku: 'UNIF-SKRT-GRY',
    nameEn: "Girls' Pleated Skirt (Gray)",
    nameAr: 'تنورة بنات رمادية بكسرات',
    subtitleEn: 'Classic Knife-Pleated Skirt',
    subtitleAr: 'التشكيلة الراقية — تنورة بكسرات أنيقة للبنات',
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
    descEn: 'Classic gray knife-pleated skirt for girls featuring elegant pleats, elasticated comfort waist, and durable premium twill.',
    descAr: 'تنورة رمادية أنيقة بكسرات وتصميم مريح مع خصر مرن وقماش عالي الجودة يدوم طويلاً.'
  },
  {
    id: 4,
    sku: 'SHOE-BOY-BLK',
    nameEn: "Boys' Black Leather Shoes",
    nameAr: 'حذاء جلدي رسمي أسود للأولاد',
    subtitleEn: 'Genuine Leather Lace-up Shoes',
    subtitleAr: 'حذاء جلدي برباط للأولاد بنعل طبي',
    category: 'Shoes',
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
    descEn: 'Genuine leather lace-up shoes for boys. Cushioned insole, non-marking rubber outsole, and scuff-resistant toe cap designed for active daily routines.',
    descAr: 'حذاء رسمي أنيق للأولاد مصنوع من الجلد الطبيعي برباط، مزود بنعل داخلي مبطن ومقاوم للانزلاق لضمان الراحة طوال اليوم.'
  },
  {
    id: 5,
    sku: 'SHOE-GRL-BLK',
    nameEn: "Girls' Mary Jane Shoes (Black)",
    nameAr: 'حذاء ماري جين أسود للبنات',
    subtitleEn: 'Classic Mary Jane Leather Shoes',
    subtitleAr: 'حذاء ماري جين كلاسيكي للبنات بحزام مريح',
    category: 'Shoes',
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
    descEn: 'Classic Mary Jane shoes for girls with secure hook-and-loop strap, supportive arch support, and sleek glossy finish.',
    descAr: 'حذاء ماري جين الكلاسيكي للبنات بحزام إغلاق عملي وقوس داعم للقدم مع مظهر أنيق ومريح طوال اليوم.'
  },
  {
    id: 6,
    sku: 'ACCS-BELT-BLK',
    nameEn: 'Classic Leather Belt (Black)',
    nameAr: 'حزام جلدي أسود كلاسيكي',
    subtitleEn: 'Adjustable Leather Belt with Silver Buckle',
    subtitleAr: 'حزام جلدي أسود بإبزيم فضي كلاسيكي',
    category: 'Accessories',
    categorySlug: 'accessories',
    price: 2.500,
    rating: 4.8,
    reviewsCount: 65,
    sizes: ['Standard (Adjustable)'],
    sizeLabel: 'Belt Size',
    defaultSize: 'Standard (Adjustable)',
    images: [
      '/products/school-accessories-set.jpg'
    ],
    descEn: 'Sturdy black synthetic leather belt with classic silver-finish buckle and multiple adjustment holes.',
    descAr: 'حزام جلدي أسود أنيق مزود بإبزيم فضي كلاسيكي متين ومناسب لجميع المقاسات.'
  },
  {
    id: 7,
    sku: 'ACCS-SOCK-WHT',
    nameEn: 'Cotton Crew Socks (White)',
    nameAr: 'جوارب قطنية بيضاء (زوج)',
    subtitleEn: 'Breathable Cotton Crew Socks',
    subtitleAr: 'جوارب قطنية بيضاء ناعمة ومتينة',
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
    descAr: 'جوارب قطنية بيضاء ناعمة ومريحة مع كعب ومشط معزز لمتانة تدوم مع كثرة الغسيل.'
  },
  {
    id: 8,
    sku: 'BOOK-ENG-P1',
    nameEn: "Cambridge Primary English Learner's Book",
    nameAr: 'كتاب كامبريدج للغة الإنجليزية للمرحلة الابتدائية',
    subtitleEn: 'Cambridge Primary English Curriculum',
    subtitleAr: 'المنهاج المعتمد — كامبريدج الابتدائية للغة الإنجليزية',
    category: 'School Books',
    categorySlug: 'books',
    price: 7.500,
    rating: 5.0,
    reviewsCount: 88,
    sizes: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6'],
    sizeLabel: 'Curriculum Stage',
    defaultSize: 'Stage 3',
    images: ['/products/cambridge-english-book.jpg'],
    descEn: 'Official Cambridge Primary English Learner Book approved for academic curriculum.',
    descAr: 'كتاب الطالب المعتمد لمنهاج كامبريدج للغة الإنجليزية.'
  },
  {
    id: 9,
    sku: 'BOOK-MTH-P1',
    nameEn: "Cambridge Primary Mathematics Learner's Book",
    nameAr: 'كتاب كامبريدج للرياضيات للمرحلة الابتدائية',
    subtitleEn: 'Cambridge Primary Mathematics Curriculum',
    subtitleAr: 'المنهاج المعتمد — كامبريدج للرياضيات',
    category: 'School Books',
    categorySlug: 'books',
    price: 7.500,
    rating: 4.9,
    reviewsCount: 76,
    sizes: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6'],
    sizeLabel: 'Curriculum Stage',
    defaultSize: 'Stage 3',
    images: ['/products/cambridge-math-book.jpg'],
    descEn: 'Official Cambridge Primary Mathematics Learner Book for learners.',
    descAr: 'كتاب كامبريدج المعتمد للرياضيات للمرحلة الابتدائية.'
  },
  {
    id: 10,
    sku: 'BOOK-ARB-P1',
    nameEn: 'Arabic Language Curriculum Textbook',
    nameAr: 'كتاب لغتي الجميلة — منهاج اللغة العربية',
    subtitleEn: 'Official Arabic Language Curriculum Textbook',
    subtitleAr: 'المنهاج المعتمد — كتاب اللغة العربية والقراءة',
    category: 'School Books',
    categorySlug: 'books',
    price: 6.500,
    rating: 4.9,
    reviewsCount: 110,
    sizes: ['Grade 1-3', 'Grade 4-6', 'Grade 7-9'],
    sizeLabel: 'Grade Level',
    defaultSize: 'Grade 4-6',
    images: ['/products/arabic-language-book.jpg'],
    descEn: 'Approved textbook for Arabic grammar, reading, and literature with engaging illustrations.',
    descAr: 'كتاب اللغة العربية المعتمد للقراءة والنحو والإملاء مع نصوص وتمارين تطبيقية.'
  },
  {
    id: 11,
    sku: 'BOOK-SCI-P1',
    nameEn: 'Cambridge Primary Science Textbook',
    nameAr: 'كتاب كامبريدج للعلوم العامة والاكتشاف',
    subtitleEn: 'Cambridge Primary Science Curriculum',
    subtitleAr: 'المنهاج المعتمد — كامبريدج للعلوم والاكتشاف',
    category: 'School Books',
    categorySlug: 'books',
    price: 7.500,
    rating: 5.0,
    reviewsCount: 95,
    sizes: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6'],
    sizeLabel: 'Curriculum Stage',
    defaultSize: 'Stage 4',
    images: ['/products/cambridge-science-book.jpg'],
    descEn: 'Official Cambridge Science learner textbook featuring scientific inquiry, biology, chemistry, and physics basics.',
    descAr: 'كتاب كامبريدج للعلوم العامة يغطي التجارب العلمية والمفاهيم البيولوجية والفيزيائية.'
  },
  {
    id: 12,
    sku: 'BAG-SPINE-MRN',
    nameEn: 'Ergonomic Spine-Support School Backpack',
    nameAr: 'حقيبة مدرسية طبية مريحة مع مقلمة',
    subtitleEn: 'Ergonomic Spine-Support School Backpack',
    subtitleAr: 'حقيبة مدرسية طبية مع دعم للعمود الفقري ومقلمة مطابقة',
    category: 'School Bags',
    categorySlug: 'school-bags',
    price: 14.500,
    rating: 5.0,
    reviewsCount: 132,
    sizes: ['Junior (Grades 1-4)', 'Senior (Grades 5-12)'],
    sizeLabel: 'Backpack Size',
    defaultSize: 'Senior (Grades 5-12)',
    images: ['/products/school-bags-accessories.jpg'],
    descEn: 'Premium ergonomic maroon backpack with orthopedic back padding, multi-compartment organizers, reflective safety strips, water-repellent fabric, and matching pencil case.',
    descAr: 'حقيبة مدرسية طبية متطورة تدعم الظهر ومزودة بحافظة لابتوب ومقلمة متناسقة وأقمشة مانعة لتسرب الماء.'
  },
  {
    id: 13,
    sku: 'LUNCH-BENTO-SET',
    nameEn: 'Thermal Bento Lunch Box & Water Bottle Set',
    nameAr: 'طقم حافظة طعام ومطارة ماء عازلة للحرارة',
    subtitleEn: 'Food-grade Stainless Steel & BPA-Free Container',
    subtitleAr: 'ستانلس ستيل غذائي آمن ومضاد للتسرب خالي من مادة BPA',
    category: 'Lunch Boxes',
    categorySlug: 'lunch-boxes',
    price: 5.500,
    rating: 4.9,
    reviewsCount: 64,
    sizes: ['Standard (750ml)', 'Large (1000ml)'],
    sizeLabel: 'Capacity Size',
    defaultSize: 'Standard (750ml)',
    images: ['/products/lunch-boxes-drinkware.jpg'],
    descEn: 'High-grade insulated lunch box with multi-layer compartments and matching leakproof water bottle. Keeps food fresh for hours.',
    descAr: 'حافظة طعام معزولة عالية الجودة مع أقسام متعددة ومطارة ماء مانعة للتسرب، تحفظ الطعام طازجاً لساعات.'
  },
  {
    id: 14,
    sku: 'HLTH-KIT-DIGI',
    nameEn: 'Comprehensive First-Aid & Hygiene Care Kit',
    nameAr: 'حقيبة الإسعافات الأولية ومستلزمات العناية',
    subtitleEn: 'Official Healthcare & Daily Hygiene Pack',
    subtitleAr: 'طقم الرعاية الصحية المعتمد وحقيبة الإسعافات الطبية',
    category: 'Healthcare',
    categorySlug: 'healthcare',
    price: 6.800,
    rating: 5.0,
    reviewsCount: 52,
    sizes: ['Standard Kit', 'Deluxe Family Pack'],
    sizeLabel: 'Kit Version',
    defaultSize: 'Standard Kit',
    images: ['/products/healthcare-personal-care.jpg'],
    descEn: 'Comprehensive health and first-aid kit containing touchless digital thermometer, medical dressings, antiseptics, sanitizers, and travel care pouches.',
    descAr: 'حقيبة إسعافات ورعاية صحية متكاملة تحتوي على ميزان حرارة رقمي، معقمات، ضمادات طبية ومستلزمات النظافة اليومية.'
  },
  {
    id: 15,
    sku: 'SPRT-TRAIN-SET',
    nameEn: 'Athletics Training Dumbbells & Sports Gear',
    nameAr: 'أثقال تدريب رياضية ومستلزمات اللياقة',
    subtitleEn: 'Neoprene Dumbbells, Athletic Ball & Skipping Rope',
    subtitleAr: 'أثقال تدريب نيوبرين وحبل قفز وكرة رياضية',
    category: 'Fitness & Sports',
    categorySlug: 'fitness-sports',
    price: 11.500,
    rating: 4.9,
    reviewsCount: 88,
    sizes: ['2kg Pair', '3kg Pair', '5kg Pair'],
    sizeLabel: 'Weight / Size',
    defaultSize: '3kg Pair',
    images: ['/products/fitness-sports-equipment.jpg'],
    descEn: 'Non-slip neoprene exercise dumbbells, high-speed skipping rope, and athletic training ball for physical education and fitness training.',
    descAr: 'أثقال تدريبية مغلفة بالنيوبرين مانعة للانزلاق مع حبل قفز متطور وكرة تدريب للأنشطة والتربية البدنية.'
  },
  {
    id: 16,
    sku: 'ELEC-CALC-FAST',
    nameEn: 'Scientific Calculator & Fast Charging Tech Kit',
    nameAr: 'آلة حاسبة علمية وطقم شحن سريع وكابلات',
    subtitleEn: 'Exam-Approved Scientific & Computing Kit',
    subtitleAr: 'طقم حسابي متطور معتمد للاختبارات والمناهج وشاحن سريع',
    category: 'Electronics',
    categorySlug: 'electronics',
    price: 8.500,
    rating: 4.8,
    reviewsCount: 71,
    sizes: ['Exam Standard'],
    sizeLabel: 'Version',
    defaultSize: 'Exam Standard',
    images: ['/products/electronics-mobile-accessories.jpg'],
    descEn: 'Multifunctional dual-power scientific calculator with high-contrast display, braided fast-charging cable, and portable emergency power accessory.',
    descAr: 'آلة حاسبة علمية دقيقة معتمدة للاختبارات مع كابل شحن سريع وشاحن جداري موثوق.'
  },
  {
    id: 17,
    sku: 'TOYS-STEM-BLKS',
    nameEn: 'STEM Science Experiment Kit & Wooden Puzzles',
    nameAr: 'طقم تجارب علمية STEM ومكعبات تعليمية',
    subtitleEn: 'Learning-Based Play & Brain Development Toys',
    subtitleAr: 'ألعاب تعليمية وتفكير وذكاء وتجارب علمية ممتعة',
    category: 'Toys & Educational',
    categorySlug: 'toys-educational',
    price: 9.500,
    rating: 5.0,
    reviewsCount: 46,
    sizes: ['Age 4-8', 'Age 8-14'],
    sizeLabel: 'Age Group',
    defaultSize: 'Age 8-14',
    images: ['/products/toys-educational-products.jpg'],
    descEn: 'Engaging STEM hands-on experiment kit with wooden building blocks and logic puzzles to foster spatial intelligence and scientific thinking.',
    descAr: 'مجموعة أنشطة علمية وتطبيقية مع مكعبات وألغاز ذكاء لتعزيز التفكير الإبداعي لدى الطلاب والأطفال.'
  },
  {
    id: 18,
    sku: 'ART-PALET-KIT',
    nameEn: 'Artist Acrylic Palette & Craft Painting Set',
    nameAr: 'طقم ألوان وفراشي رسم وأشغال فنية يدوية',
    subtitleEn: 'Rich Pigment Artist Paints, Wooden Palette & Brushes',
    subtitleAr: 'ألوان زيتية ومائية فاخرة مع باليتة خشبية ومجموعة فراشي احترافية',
    category: 'Gifts & Art',
    categorySlug: 'gifts-craft',
    price: 4.800,
    rating: 4.9,
    reviewsCount: 58,
    sizes: ['12-Color Set', '24-Color Set'],
    sizeLabel: 'Set Size',
    defaultSize: '24-Color Set',
    images: ['/products/gifts-art-craft.jpg'],
    descEn: 'Complete fine-art painting set with non-toxic vibrant pigments, classic wooden palette, sketch paper, and precision artist brushes.',
    descAr: 'طقم رسم وفنون تشكيلية متكامل بألوان ناصعة غير سامة وباليتة خشبية متينة وفراشي رسم دقيقة.'
  },
  {
    id: 19,
    sku: 'HOME-STOR-ORGN',
    nameEn: 'Multipurpose Home & Study Storage Organizers',
    nameAr: 'صناديق تنظيم وترتيب منزلية ومكتبية',
    subtitleEn: 'Stackable Transparent Storage Boxes & Dispensers',
    subtitleAr: 'صناديق شفافة قابلة للتكديس لتنظيم المكاتب والمستلزمات المنزلية',
    category: 'Household',
    categorySlug: 'household',
    price: 5.200,
    rating: 4.8,
    reviewsCount: 63,
    sizes: ['Medium 3-Pack', 'Large 2-Pack'],
    sizeLabel: 'Pack Size',
    defaultSize: 'Medium 3-Pack',
    images: ['/products/household-daily-essentials.jpg'],
    descEn: 'Durable, stackable storage organizers with ergonomic handles and clear view compartments for household essentials, study items, and tools.',
    descAr: 'صناديق تنظيم عملية وشفافة متعددة الاستخدامات لتخزين الأدوات المدرسية والمنزلية بسهولة.'
  },
  {
    id: 20,
    sku: 'TRVL-DUFF-BAG',
    nameEn: 'Waterproof Travel Luggage Duffel & Outdoor Bag',
    nameAr: 'حقيبة سفر ورحلات خارجية متينة مقاومة للماء',
    subtitleEn: 'Heavy-Duty Water-Repellent Adventure Bag',
    subtitleAr: 'حقيبة رحلات متينة ومقاومة للماء مع منظمات داخلية وحزام كتف مريح',
    category: 'Travel & Outdoor',
    categorySlug: 'travel-outdoor',
    price: 13.000,
    rating: 5.0,
    reviewsCount: 71,
    sizes: ['Medium (35L)', 'Large (55L)'],
    sizeLabel: 'Bag Capacity',
    defaultSize: 'Medium (35L)',
    images: ['/products/travel-outdoor-accessories.jpg'],
    descEn: 'Spacious all-weather travel bag with reinforced carry handles, adjustable shoulder strap, water-resistant zippers, and travel packing pouch organizers.',
    descAr: 'حقيبة سفر واسعة ومقاومة لجميع الظروف الجوية مزودة بمقابض معززة وحزام كتف قابل للتعديل ومقصورة خاصة للمستلزمات.'
  }
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { t, isRTL } = useLanguage();
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [productsList, setProductsList] = useState(() => getCatalogProducts());

  useEffect(() => {
    const handleUpdate = () => {
      setProductsList(getCatalogProducts());
    };
    window.addEventListener('ips-products-updated', handleUpdate);
    return () => window.removeEventListener('ips-products-updated', handleUpdate);
  }, []);

  // Find the exact product clicked
  const productId = parseInt(id, 10) || 1;
  const product = useMemo(() => {
    return productsList.find(p => p.id === productId) || productsList[0] || {};
  }, [productsList, productId]);

  const [selectedSize, setSelectedSize] = useState(product?.defaultSize || (product?.sizes && product.sizes[0]) || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [added, setAdded] = useState(false);

  // Update selected size and reset thumbnail when navigating between products
  useEffect(() => {
    if (product) {
      setSelectedSize(product.defaultSize || (product.sizes && product.sizes[0]) || 'Standard');
      setActiveThumb(0);
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product]);

  // Recommended items excluding current product
  const recommendedItems = useMemo(() => {
    return productsList.filter(p => p.id !== product?.id).slice(0, 6);
  }, [productsList, product?.id]);

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

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: { from: { pathname: '/cart' }, message: isRTL ? 'يرجى تسجيل الدخول أولاً لإتمام الشراء.' : 'Please log in to purchase.' }
      });
      return;
    }
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
    navigate('/cart');
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
              <span>{isRTL ? 'متوفر بالمخزون (صلالة)' : 'In Stock (Salalah)'}</span>
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
            <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '1.25rem', color: '#92400e', fontSize: '0.86rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={16} style={{ color: '#b45309', flexShrink: 0 }} />
                <span style={{ fontWeight: '600' }}>
                  {isRTL
                    ? 'شراء المنتجات يتطلب تسجيل الدخول أولاً.'
                    : 'Customer login is required to purchase items.'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link
                  to="/login"
                  state={{ from: { pathname: `/product/${product.id}` }, message: isRTL ? 'يرجى تسجيل الدخول أولاً لإتمام الشراء والطلب.' : 'Please log in to purchase and place an order.' }}
                  style={{
                    backgroundColor: '#800020',
                    color: '#ffffff',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <User size={14} />
                  <span>{isRTL ? 'تسجيل الدخول للمتابعة' : 'Sign In to Proceed'}</span>
                </Link>
              </div>
            </div>
          )}

          {/* Action Buttons: Add to Cart, Buy Now & Wishlist */}
          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleAddCurrent}
                  className="btn-primary"
                  style={{ flex: 1, minWidth: '160px', padding: '0.85rem 1.25rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', backgroundColor: added ? '#16a34a' : '#800020' }}
                >
                  <ShoppingCart size={18} />
                  <span>{added ? (isRTL ? 'تمت الإضافة!' : 'Added!') : (isRTL ? 'إضافة إلى السلة' : 'Add to Cart')}</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  style={{
                    flex: 1,
                    minWidth: '160px',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: '800',
                    backgroundColor: '#ffd700',
                    color: '#4a0012',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)'
                  }}
                >
                  <span>{isRTL ? 'شراء الآن مباشرة' : 'Buy Now'}</span>
                  <ArrowRight size={17} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
                </button>
              </>
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
                padding: '0.85rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                backgroundColor: '#ffffff',
                color: isInWishlist(product.id) ? '#dc2626' : '#374151',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Heart size={18} fill={isInWishlist(product.id) ? '#dc2626' : 'none'} />
              <span>{isInWishlist(product.id) ? (isRTL ? 'في المفضلة' : 'Saved') : (isRTL ? 'المفضلة' : 'Wishlist')}</span>
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
