// Unified Persistent Product & Catalog Store for Shop
// Supports Admin Price Editing, Size Management, Category Controls, Product Addition & Deletion.

export const OFFICIAL_CATEGORIES = [
  { id: 'school-uniforms', number: 1, nameEn: 'School Uniforms & Attire', nameAr: 'الزي المدرسي والملابس', group: 'CLOTHING', icon: '👕', tagEn: 'Collection 01', tagAr: 'التشكيلة 01' },
  { id: 'school-bags', number: 2, nameEn: 'School Bags & Packs', nameAr: 'الحقائب المدرسية والمستلزمات', group: 'ESSENTIALS', icon: '🎒', tagEn: 'Collection 02', tagAr: 'التشكيلة 02' },
  { id: 'stationery-books', number: 3, nameEn: 'Academic Books & Stationery', nameAr: 'الكتب والقرطاسية الأكاديمية', group: 'STUDY', icon: '📚', tagEn: 'Collection 03', tagAr: 'التشكيلة 03' },
  { id: 'lunch-boxes', number: 4, nameEn: 'Dining & Drinkware', nameAr: 'علب الطعام ومطارات المشروبات', group: 'ESSENTIALS', icon: '🍱', tagEn: 'Collection 04', tagAr: 'التشكيلة 04' },
  { id: 'healthcare', number: 5, nameEn: 'Wellness & Personal Care', nameAr: 'الرعاية الصحية والعناية', group: 'HEALTH', icon: '🩺', tagEn: 'Collection 05', tagAr: 'التشكيلة 05' },
  { id: 'fitness-sports', number: 6, nameEn: 'Athletics & Sports Gear', nameAr: 'اللياقة والرياضة البدنية', group: 'TECH_SPORTS', icon: '🏃', tagEn: 'Collection 06', tagAr: 'التشكيلة 06' },
  { id: 'electronics', number: 7, nameEn: 'Electronics & Tech Gear', nameAr: 'الإلكترونيات وملحقات التقنية', group: 'TECH_SPORTS', icon: '⚡', tagEn: 'Collection 07', tagAr: 'التشكيلة 07' },
  { id: 'toys-educational', number: 8, nameEn: 'Educational & STEM Play', nameAr: 'ألعاب الذكاء والتعليم', group: 'STUDY', icon: '🧩', tagEn: 'Collection 08', tagAr: 'التشكيلة 08' },
  { id: 'gifts-craft', number: 9, nameEn: 'Fine Arts, Crafts & Gifts', nameAr: 'الهدايا والأعمال الفنية', group: 'STUDY', icon: '🎨', tagEn: 'Collection 09', tagAr: 'التشكيلة 09' },
  { id: 'household', number: 10, nameEn: 'Household Essentials', nameAr: 'المستلزمات والمنظمات المنزلية', group: 'ESSENTIALS', icon: '🏠', tagEn: 'Collection 10', tagAr: 'التشكيلة 10' },
  { id: 'travel-outdoor', number: 11, nameEn: 'Travel & Outdoor Luggage', nameAr: 'السفر والرحلات الخارجية', group: 'ESSENTIALS', icon: '🧳', tagEn: 'Collection 11', tagAr: 'التشكيلة 11' }
];

export const INITIAL_PRODUCTS = [
  {
    id: 1,
    sku: 'UNIF-POLO-MRN',
    nameEn: 'Official Polo Shirt (Maroon)',
    nameAr: 'قميص بولو مدرسي رسمي (عنابي)',
    subtitleEn: 'Official School Uniform — Maroon Polo Shirt',
    subtitleAr: 'الزي المدرسي الرسمي — قميص بولو عنابي',
    category: 'school-uniforms',
    collectionEn: 'Uniforms & Attire',
    collectionAr: 'الأزياء المدرسية',
    price: 6.000,
    stock: 85,
    threshold: 15,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    sizeLabel: 'Shirt Size',
    defaultSize: 'M',
    image: '/products/polo-shirt-front.jpg',
    images: [
      '/products/polo-shirt-front.jpg',
      '/products/polo-shirt-back.jpg',
      '/products/polo-collar-detail.jpg',
      '/products/polo-fabric-detail.jpg'
    ],
    descEn: 'Breathable cotton pique polo shirt with contrast gold collar and reinforced stitching for daily school wear.',
    descAr: 'قميص بولو قطني مريح بياقة مذهبة أنيقة للمدرسة وتطريز فاخر ملائم للاستخدام اليومي.',
    isActive: true
  },
  {
    id: 2,
    sku: 'UNIF-TRSR-GRY',
    nameEn: "Boys' Formal Trousers (Gray)",
    nameAr: 'بنطال رمادي رسمي للأولاد',
    subtitleEn: 'Official School Uniform — Regular Fit Trousers',
    subtitleAr: 'الزي المدرسي الرسمي — بنطال رمادي مريح للأولاد',
    category: 'school-uniforms',
    subCategory: 'boys-trousers',
    collectionEn: 'Formal Attire',
    collectionAr: 'الأزياء المدرسية',
    price: 8.500,
    stock: 55,
    threshold: 10,
    sizes: ['26', '28', '30', '32', '34', '36'],
    sizeLabel: 'Waist Size (Inches)',
    defaultSize: '30',
    image: '/products/boys-gray-trousers.jpg',
    images: ['/products/boys-gray-trousers.jpg'],
    descEn: 'Regular fit durable school trousers with adjustable waist and wrinkle resistance.',
    descAr: 'بنطال مدرسي رمادي مريح للأولاد بخياطة متينة ومقاس مريح مع خصر داخلي قابل للتعديل.',
    isActive: true
  },
  {
    id: 3,
    sku: 'UNIF-SKRT-GRY',
    nameEn: "Girls' Pleated Skirt (Gray)",
    nameAr: 'تنورة رمادية بكسرات للبنات',
    subtitleEn: 'Official School Uniform — Pleated Skirt',
    subtitleAr: 'الزي المدرسي الرسمي — تنورة بكسرات أنيقة للبنات',
    category: 'school-uniforms',
    subCategory: 'girls-skirts',
    collectionEn: 'Classic Uniform',
    collectionAr: 'الأزياء المدرسية',
    price: 8.000,
    stock: 60,
    threshold: 10,
    sizes: ['26', '28', '30', '32', '34', '36'],
    sizeLabel: 'Waist Size (Inches)',
    defaultSize: '28',
    image: '/products/girls-gray-skirt.jpg',
    images: ['/products/girls-gray-skirt.jpg'],
    descEn: 'Comfortable classic pleated school skirt with wrinkle resistance and flexible elastic waist.',
    descAr: 'تنورة مدرسية مريحة بكسرات أنيقة وقماش متين مقاوم للتجعد مع خصر مرن.',
    isActive: true
  },
  {
    id: 4,
    sku: 'SHOE-BOY-BLK',
    nameEn: "Boys' Oxford Shoes (Black Leather)",
    nameAr: 'حذاء جلدي رسمي أسود للأولاد',
    subtitleEn: 'Genuine Leather Lace-up School Shoes',
    subtitleAr: 'حذاء جلدي برباط للأولاد بنعل طبي',
    category: 'school-uniforms',
    subCategory: 'shoes',
    collectionEn: 'Footwear Collection',
    collectionAr: 'تشكيلة الأحذية',
    price: 12.500,
    stock: 35,
    threshold: 8,
    sizes: ['32', '34', '36', '38', '40', '42'],
    sizeLabel: 'Shoe Size (EU)',
    defaultSize: '36',
    image: '/products/boys-black-shoes.jpg',
    images: ['/products/boys-black-shoes.jpg'],
    descEn: 'Genuine scuff-resistant leather with non-marking rubber outsole and cushioned arch support.',
    descAr: 'حذاء جلدي متين ومريح للأولاد للمدرسة بنعل طبي مانع للانزلاق ومقاوم للاحتكاك.',
    isActive: true
  },
  {
    id: 5,
    sku: 'SHOE-GRL-BLK',
    nameEn: "Girls' Mary Jane Shoes (Black)",
    nameAr: 'حذاء ماري جين أسود للبنات',
    subtitleEn: 'Classic Mary Jane Buckle Shoes',
    subtitleAr: 'حذاء ماري جين كلاسيكي للبنات بحزام مريح',
    category: 'school-uniforms',
    subCategory: 'shoes',
    collectionEn: 'Footwear Collection',
    collectionAr: 'تشكيلة الأحذية',
    price: 12.500,
    stock: 28,
    threshold: 6,
    sizes: ['30', '32', '34', '36', '38', '40'],
    sizeLabel: 'Shoe Size (EU)',
    defaultSize: '34',
    image: '/products/girls-black-shoes.jpg',
    images: ['/products/girls-black-shoes.jpg'],
    descEn: 'Classic Mary Jane leather shoe with supportive arch insole and easy velcro strap.',
    descAr: 'حذاء كلاسيكي أنيق ومريح للبنات للمدرسة بحزام مريح ونعل داخلي يدعم القدم.',
    isActive: true
  },
  {
    id: 6,
    sku: 'ACCS-BELT-SET',
    nameEn: 'Official Uniform Belt & Accessories',
    nameAr: 'حزام مدرسي جلدي وإكسسوارات',
    subtitleEn: 'Adjustable Leather Belt with Silver Buckle',
    subtitleAr: 'حزام جلدي أسود بإبزيم فضي كلاسيكي',
    category: 'school-uniforms',
    subCategory: 'accessories',
    collectionEn: 'Accessories',
    collectionAr: 'إكسسوارات الزي',
    price: 2.500,
    stock: 120,
    threshold: 15,
    sizes: ['Standard (Adjustable)'],
    sizeLabel: 'Belt Size',
    defaultSize: 'Standard (Adjustable)',
    image: '/products/school-accessories-set.jpg',
    images: ['/products/school-accessories-set.jpg'],
    descEn: 'Sturdy black synthetic leather belt with polished silver buckle and adjustable holes.',
    descAr: 'حزام جلدي أسود أنيق قابل للتعديل ومتين لجميع الأعمار بإبزيم معدني مصقول.',
    isActive: true
  },
  {
    id: 7,
    sku: 'ACCS-SOCK-WHT',
    nameEn: 'Cotton School Socks (White Pair)',
    nameAr: 'جوارب مدرسية بيضاء قطنية (زوج)',
    subtitleEn: 'Cotton Crew School Socks',
    subtitleAr: 'جوارب قطنية بيضاء ناعمة',
    category: 'school-uniforms',
    subCategory: 'accessories',
    collectionEn: 'Accessories',
    collectionAr: 'إكسسوارات الزي',
    price: 1.000,
    stock: 200,
    threshold: 25,
    sizes: ['S (28-33)', 'M (34-38)', 'L (39-44)'],
    sizeLabel: 'Sock Size',
    defaultSize: 'M (34-38)',
    image: '/products/school-socks-white.jpg',
    images: ['/products/school-socks-white.jpg'],
    descEn: 'Breathable combed cotton socks with reinforced heel and toe for school durability.',
    descAr: 'جوارب قطنية ناعمة ومتينة تدوم طويلاً مع الغسيل المتكرر وتوفر راحة طوال اليوم.',
    isActive: true
  },
  {
    id: 8,
    sku: 'BOOK-ENG-P1',
    nameEn: "Cambridge Primary English Learner's Book",
    nameAr: 'كتاب كامبريدج للغة الإنجليزية (الابتدائي)',
    subtitleEn: 'Cambridge Primary English Curriculum',
    subtitleAr: 'المنهاج المعتمد — كامبريدج للغة الإنجليزية',
    category: 'stationery-books',
    collectionEn: 'Academic & Books',
    collectionAr: 'الكتب الأكاديمية',
    price: 7.500,
    stock: 68,
    threshold: 12,
    sizes: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6'],
    sizeLabel: 'Curriculum Stage',
    defaultSize: 'Stage 3',
    image: '/products/cambridge-english-book.jpg',
    images: ['/products/cambridge-english-book.jpg'],
    descEn: 'Official Cambridge curriculum textbook for English learners with exercises and reading texts.',
    descAr: 'كتاب الطالب المعتمد لمنهاج كامبريدج الدولي للغة الإنجليزية مع أنشطة وتمارين.',
    isActive: true
  },
  {
    id: 9,
    sku: 'BOOK-MTH-P1',
    nameEn: "Cambridge Primary Mathematics Learner's Book",
    nameAr: 'كتاب كامبريدج للرياضيات (الابتدائي)',
    subtitleEn: 'Cambridge Primary Mathematics Curriculum',
    subtitleAr: 'المنهاج المعتمد — كامبريدج للرياضيات',
    category: 'stationery-books',
    collectionEn: 'Academic & Books',
    collectionAr: 'الكتب الأكاديمية',
    price: 7.500,
    stock: 74,
    threshold: 12,
    sizes: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6'],
    sizeLabel: 'Curriculum Stage',
    defaultSize: 'Stage 3',
    image: '/products/cambridge-math-book.jpg',
    images: ['/products/cambridge-math-book.jpg'],
    descEn: 'Official Cambridge curriculum textbook for Mathematics covering arithmetic, geometry, and problem solving.',
    descAr: 'كتاب الرياضيات المعتمد لمنهاج كامبريدج للتعليم الأساسي لتنمية التفكير الحسابي والهندسي.',
    isActive: true
  },
  {
    id: 10,
    sku: 'BOOK-ARB-P1',
    nameEn: 'Arabic Language Curriculum Textbook',
    nameAr: 'كتاب لغتي الجميلة — منهاج اللغة العربية',
    subtitleEn: 'Official Arabic Language Curriculum Textbook',
    subtitleAr: 'المنهاج المعتمد — كتاب اللغة العربية والقراءة',
    category: 'stationery-books',
    collectionEn: 'Academic & Books',
    collectionAr: 'الكتب الأكاديمية',
    price: 6.500,
    stock: 90,
    threshold: 15,
    sizes: ['Grade 1-3', 'Grade 4-6', 'Grade 7-9'],
    sizeLabel: 'Grade Level',
    defaultSize: 'Grade 4-6',
    image: '/products/arabic-language-book.jpg',
    images: ['/products/arabic-language-book.jpg'],
    descEn: 'Official curriculum Arabic textbook for grammar, reading, vocabulary, and composition.',
    descAr: 'كتاب اللغة العربية المعتمد للقراءة والنحو والإملاء والتعبير البلاغي.',
    isActive: true
  },
  {
    id: 11,
    sku: 'BOOK-SCI-P1',
    nameEn: 'Cambridge Primary Science Textbook',
    nameAr: 'كتاب كامبريدج للعلوم العامة والاكتشاف',
    subtitleEn: 'Cambridge Primary Science Curriculum',
    subtitleAr: 'المنهاج المعتمد — كامبريدج للعلوم والاكتشاف',
    category: 'stationery-books',
    collectionEn: 'Academic & Books',
    collectionAr: 'الكتب الأكاديمية',
    price: 7.500,
    stock: 65,
    threshold: 12,
    sizes: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6'],
    sizeLabel: 'Curriculum Stage',
    defaultSize: 'Stage 4',
    image: '/products/cambridge-science-book.jpg',
    images: ['/products/cambridge-science-book.jpg'],
    descEn: 'Official Science learner textbook with practical investigations, scientific models, and discoveries.',
    descAr: 'كتاب العلوم والتجارب المعتمد لمنهاج كامبريدج الدولي لدراسة الأحياء والكيمياء والفيزياء.',
    isActive: true
  },
  {
    id: 12,
    sku: 'BAG-SPINE-MRN',
    nameEn: 'Ergonomic Spine-Support School Backpack',
    nameAr: 'حقيبة مدرسية طبية مريحة مع مقلمة',
    subtitleEn: 'Orthopedic Multi-Compartment School Backpack',
    subtitleAr: 'حقيبة ظهر طبية مبطنة لدعم العمود الفقري ومقاومة للماء',
    category: 'school-bags',
    collectionEn: 'School Bags',
    collectionAr: 'الحقائب المدرسية',
    price: 14.500,
    stock: 40,
    threshold: 8,
    sizes: ['Junior (Grades 1-4)', 'Senior (Grades 5-12)'],
    sizeLabel: 'Backpack Size',
    defaultSize: 'Senior (Grades 5-12)',
    image: '/products/school-bags-accessories.jpg',
    images: ['/products/school-bags-accessories.jpg'],
    descEn: 'Multi-compartment water-resistant backpack with laptop sleeve, spine support, and pencil case.',
    descAr: 'حقيبة ظهر طبية مريحة مبطنة لدعم العمود الفقري ومقاومة للماء مع مقلمة مطابقة وحافظة لابتوب.',
    isActive: true
  },
  {
    id: 13,
    sku: 'LUNCH-BENTO-SET',
    nameEn: 'Thermal Bento Lunch Box & Water Bottle Set',
    nameAr: 'طقم حافظة طعام ومطارة ماء عازلة للحرارة',
    subtitleEn: 'BPA-Free Food Grade Thermal Bento Set',
    subtitleAr: 'حافظة طعام ومطارة ستانلس ستيل عازلة للحرارة',
    category: 'lunch-boxes',
    collectionEn: 'Dining & Drinkware',
    collectionAr: 'المستلزمات اليومية',
    price: 5.500,
    stock: 52,
    threshold: 10,
    sizes: ['Standard (750ml)', 'Large (1000ml)'],
    sizeLabel: 'Capacity Size',
    defaultSize: 'Standard (750ml)',
    image: '/products/lunch-boxes-drinkware.jpg',
    images: ['/products/lunch-boxes-drinkware.jpg'],
    descEn: 'BPA-free leakproof lunch container with stainless steel insulated bottle to keep food warm/cold.',
    descAr: 'حافظة طعام مانعة للتسرب صحية مع مطارة ماء ستانلس ستيل عازلة تحفظ المشروبات باردة أو ساخنة.',
    isActive: true
  },
  {
    id: 14,
    sku: 'HLTH-KIT-DIGI',
    nameEn: 'Comprehensive First-Aid & Hygiene Care Kit',
    nameAr: 'حقيبة الإسعافات الأولية ومستلزمات العناية',
    subtitleEn: 'School & Daily Healthcare Kit',
    subtitleAr: 'طقم متكامل للإسعافات وميزان حرارة إلكتروني',
    category: 'healthcare',
    collectionEn: 'Wellness & Care',
    collectionAr: 'العناية والصحة',
    price: 6.800,
    stock: 45,
    threshold: 8,
    sizes: ['Standard Kit', 'Deluxe Family Pack'],
    sizeLabel: 'Kit Type',
    defaultSize: 'Standard Kit',
    image: '/products/healthcare-personal-care.jpg',
    images: ['/products/healthcare-personal-care.jpg'],
    descEn: 'Complete first-aid kit with infrared touchless thermometer, sanitizers, and antiseptic dressings.',
    descAr: 'طقم متكامل للإسعافات الأولية، ميزان حرارة إلكتروني ومعقمات طبية وضمادات مجهزة بالكامل.',
    isActive: true
  },
  {
    id: 15,
    sku: 'SPRT-TRAIN-SET',
    nameEn: 'Athletics Training Dumbbells & Sports Gear',
    nameAr: 'أثقال تدريب رياضية ومستلزمات اللياقة',
    subtitleEn: 'PE Training & Fitness Equipment Set',
    subtitleAr: 'أثقال تدريب نيوبرين وحبل قفز وكرة رياضية',
    category: 'fitness-sports',
    collectionEn: 'Athletics & Sports',
    collectionAr: 'اللياقة والرياضة',
    price: 11.500,
    stock: 32,
    threshold: 6,
    sizes: ['2kg Pair', '3kg Pair', '5kg Pair'],
    sizeLabel: 'Weight Spec',
    defaultSize: '3kg Pair',
    image: '/products/fitness-sports-equipment.jpg',
    images: ['/products/fitness-sports-equipment.jpg'],
    descEn: 'Neoprene coated dumbbells, high-speed skipping rope, and athletic ball for sports exercises.',
    descAr: 'أثقال تدريب مغلفة بالنيوبرين، حبل قفز سريع وكرة رياضية لحصص التربية البدنية والتدريب.',
    isActive: true
  },
  {
    id: 16,
    sku: 'ELEC-CALC-FAST',
    nameEn: 'Scientific Calculator & Fast Charging Tech Kit',
    nameAr: 'آلة حاسبة علمية وطقم شحن سريع وكابلات',
    subtitleEn: 'Exam Standard Calculator & Charging Accessories',
    subtitleAr: 'آلة حاسبة علمية معتمدة للاختبارات وشاحن سريع',
    category: 'electronics',
    collectionEn: 'Electronics & Tech',
    collectionAr: 'الإلكترونيات والتقنية',
    price: 8.500,
    stock: 30,
    threshold: 8,
    sizes: ['Exam Standard'],
    sizeLabel: 'Specification',
    defaultSize: 'Exam Standard',
    image: '/products/electronics-mobile-accessories.jpg',
    images: ['/products/electronics-mobile-accessories.jpg'],
    descEn: 'Approved scientific calculator, USB-C braided fast charging cable, and portable backup power accessory.',
    descAr: 'آلة حاسبة علمية معتمدة للاختبارات وشاحن سريع وبطارية طوارئ وكابل مقاوم للقطع.',
    isActive: true
  },
  {
    id: 17,
    sku: 'TOYS-STEM-BLKS',
    nameEn: 'STEM Science Experiment Kit & Wooden Puzzles',
    nameAr: 'طقم تجارب علمية STEM ومكعبات تعليمية',
    subtitleEn: 'Hands-on Learning STEM Experiments',
    subtitleAr: 'أنشطة وتجارب علمية ممتعة ومكعبات ذكاء',
    category: 'toys-educational',
    collectionEn: 'Educational & STEM',
    collectionAr: 'التعليم والذكاء',
    price: 9.500,
    stock: 25,
    threshold: 5,
    sizes: ['Age 4-8', 'Age 8-14'],
    sizeLabel: 'Target Age',
    defaultSize: 'Age 8-14',
    image: '/products/toys-educational-products.jpg',
    images: ['/products/toys-educational-products.jpg'],
    descEn: 'Hands-on learning science kit with geometric puzzle blocks and physics discovery experiments.',
    descAr: 'طقم أنشطة وتجارب علمية ممتعة مع مكعبات ذكاء للأطفال لتنمية مهارات التفكير والاستكشاف.',
    isActive: true
  },
  {
    id: 18,
    sku: 'ART-PALET-KIT',
    nameEn: 'Artist Acrylic Palette & Craft Painting Set',
    nameAr: 'طقم ألوان وفراشي رسم وأشغال فنية يدوية',
    subtitleEn: 'Fine Arts Paint Tubes & Wooden Palette',
    subtitleAr: 'ألوان فاخرة ناصعة مع باليتة خشبية ومجموعة فراشي',
    category: 'gifts-craft',
    collectionEn: 'Fine Arts & Gifts',
    collectionAr: 'الفنون والهدايا',
    price: 4.800,
    stock: 50,
    threshold: 10,
    sizes: ['12-Color Set', '24-Color Set'],
    sizeLabel: 'Palette Size',
    defaultSize: '24-Color Set',
    image: '/products/gifts-art-craft.jpg',
    images: ['/products/gifts-art-craft.jpg'],
    descEn: 'Rich pigment paint tubes, wooden mixing palette, and assorted fine artist brushes for creative school projects.',
    descAr: 'ألوان رسم ناصعة مع باليتة خشبية ومجموعة فراشي احترافية مناسبة لحصص الرسم والأنشطة الإبداعية.',
    isActive: true
  },
  {
    id: 19,
    sku: 'HOME-STOR-ORGN',
    nameEn: 'Multipurpose Home & Study Storage Organizers',
    nameAr: 'صناديق تنظيم وترتيب منزلية ومكتبية',
    subtitleEn: 'Stackable Transparent Storage Boxes',
    subtitleAr: 'صناديق ترتيب أنيقة ومتينة للمنزل والمكتب',
    category: 'household',
    collectionEn: 'Home Essentials',
    collectionAr: 'المستلزمات المنزلية',
    price: 5.200,
    stock: 45,
    threshold: 8,
    sizes: ['Medium 3-Pack', 'Large 2-Pack'],
    sizeLabel: 'Storage Size',
    defaultSize: 'Medium 3-Pack',
    image: '/products/household-daily-essentials.jpg',
    images: ['/products/household-daily-essentials.jpg'],
    descEn: 'Stackable transparent storage boxes with handle dispensers for desks, home organizers, and school books.',
    descAr: 'صناديق ترتيب أنيقة ومتينة للمنزل والمكتب بأحجام متعددة وتنظيم متناسق للأدوات والكتب.',
    isActive: true
  },
  {
    id: 20,
    sku: 'TRVL-DUFF-BAG',
    nameEn: 'Waterproof Travel Luggage Duffel & Outdoor Bag',
    nameAr: 'حقيبة سفر ورحلات خارجية متينة مقاومة للماء',
    subtitleEn: 'Heavy Duty Adventure Duffel Bag',
    subtitleAr: 'حقيبة سفر ورحلات خارجية متينة مع منظمات مدمجة',
    category: 'travel-outdoor',
    collectionEn: 'Travel & Outdoor',
    collectionAr: 'السفر والرحلات',
    price: 13.000,
    stock: 35,
    threshold: 5,
    sizes: ['Medium (35L)', 'Large (55L)'],
    sizeLabel: 'Capacity',
    defaultSize: 'Medium (35L)',
    image: '/products/travel-outdoor-accessories.jpg',
    images: ['/products/travel-outdoor-accessories.jpg'],
    descEn: 'Reinforced travel duffel with organizer pouches, adjustable shoulder strap, and waterproof heavy fabric.',
    descAr: 'حقيبة سفر ورحلات خارجية متينة مع منظمات مدمجة وحزام كتف مريح ومقاومة للأمطار والأتربة.',
    isActive: true
  }
];

const STORAGE_KEY = 'ips_catalog_products';

// Read all catalog products from localStorage (or fallback to INITIAL_PRODUCTS)
export function getCatalogProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading catalog products from storage:', err);
  }
  // Initialize default
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
  } catch (_) {}
  return INITIAL_PRODUCTS;
}

// Save all products and notify listeners across windows / components
export function saveCatalogProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Error saving catalog products:', err);
  }
  // Dispatch custom event for real-time reactive UI update
  try {
    window.dispatchEvent(new CustomEvent('ips-products-updated', { detail: products }));
  } catch (_) {}
}

// Add a new product (Extra thing in shop)
export function addProduct(newProduct) {
  const current = getCatalogProducts();
  const maxId = current.reduce((max, p) => (p.id > max ? p.id : max), 0);
  const newId = maxId + 1;

  // Auto-map category to collection title
  const catObj = OFFICIAL_CATEGORIES.find(c => c.id === newProduct.category) || OFFICIAL_CATEGORIES[0];

  const fullProduct = {
    id: newId,
    sku: newProduct.sku?.trim() || `SKU-${Date.now().toString().slice(-6)}`,
    nameEn: newProduct.nameEn?.trim() || 'New Store Product',
    nameAr: newProduct.nameAr?.trim() || 'منتج متجر جديد',
    subtitleEn: newProduct.subtitleEn?.trim() || newProduct.nameEn || '',
    subtitleAr: newProduct.subtitleAr?.trim() || newProduct.nameAr || '',
    category: newProduct.category || catObj.id,
    subCategory: newProduct.subCategory || '',
    collectionEn: catObj.nameEn,
    collectionAr: catObj.nameAr,
    price: parseFloat(newProduct.price) || 1.000,
    stock: parseInt(newProduct.stock, 10) || 20,
    threshold: parseInt(newProduct.threshold, 10) || 5,
    sizes: Array.isArray(newProduct.sizes) && newProduct.sizes.length > 0
      ? newProduct.sizes
      : (typeof newProduct.sizes === 'string' && newProduct.sizes.trim()
          ? newProduct.sizes.split(',').map(s => s.trim()).filter(Boolean)
          : ['Standard']),
    sizeLabel: newProduct.sizeLabel || 'Option / Size',
    defaultSize: (Array.isArray(newProduct.sizes) && newProduct.sizes[0]) || 'Standard',
    image: newProduct.image?.trim() || '/products/polo-shirt-front.jpg',
    images: [newProduct.image?.trim() || '/products/polo-shirt-front.jpg'],
    descEn: newProduct.descEn?.trim() || 'High quality store item with genuine materials and durability.',
    descAr: newProduct.descAr?.trim() || 'منتج عالي الجودة متوفر للشراء المباشر مع ضمان الجودة.',
    isActive: true
  };

  const updated = [fullProduct, ...current];
  saveCatalogProducts(updated);
  return fullProduct;
}

// Update existing product (Price, Sizes, Stock, Category, Descriptions, Image, etc.)
export function updateProduct(id, updates) {
  const current = getCatalogProducts();
  const updated = current.map(p => {
    if (p.id === id) {
      const merged = { ...p, ...updates };
      // If price was updated, ensure float
      if (updates.price !== undefined) {
        merged.price = parseFloat(updates.price);
      }
      // If stock was updated, ensure int
      if (updates.stock !== undefined) {
        merged.stock = parseInt(updates.stock, 10);
      }
      // If threshold was updated
      if (updates.threshold !== undefined) {
        merged.threshold = parseInt(updates.threshold, 10);
      }
      // If sizes was passed as comma-separated string
      if (typeof updates.sizes === 'string') {
        merged.sizes = updates.sizes.split(',').map(s => s.trim()).filter(Boolean);
        if (!merged.sizes.includes(merged.defaultSize)) {
          merged.defaultSize = merged.sizes[0] || 'Standard';
        }
      }
      // If category was changed, sync collection titles
      if (updates.category) {
        const catObj = OFFICIAL_CATEGORIES.find(c => c.id === updates.category);
        if (catObj) {
          merged.collectionEn = catObj.nameEn;
          merged.collectionAr = catObj.nameAr;
        }
      }
      // If image was changed, sync images array
      if (updates.image) {
        merged.images = [updates.image, ...(p.images || []).filter(img => img !== updates.image)];
      }
      return merged;
    }
    return p;
  });

  saveCatalogProducts(updated);
  return updated.find(p => p.id === id);
}

// Delete product
export function deleteProduct(id) {
  const current = getCatalogProducts();
  const updated = current.filter(p => p.id !== id);
  saveCatalogProducts(updated);
  return updated;
}

// Reset catalog to default proposal items
export function resetCatalogToDefault() {
  saveCatalogProducts(INITIAL_PRODUCTS);
  return INITIAL_PRODUCTS;
}
