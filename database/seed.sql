USE `ips_school_shop`;

-- ------------------------------------------------------------------------------
-- SEED ROLES
-- ------------------------------------------------------------------------------
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'ADMIN', 'School shop administrator with full inventory and order controls'),
(2, 'STAFF', 'School store staff for pickup verification and inventory management'),
(3, 'PARENT', 'Registered student parent or guardian');

-- ------------------------------------------------------------------------------
-- SEED CATEGORIES
-- ------------------------------------------------------------------------------
INSERT INTO `categories` (`id`, `name_en`, `name_ar`, `slug`, `icon_name`, `display_order`) VALUES
(1, 'School Uniforms', 'الزي المدرسي', 'uniforms', 'Shirt', 1),
(2, 'Boys\' Trousers', 'بناطيل الأولاد', 'boys-trousers', 'Scissors', 2),
(3, 'Girls\' Skirts', 'تنانير البنات', 'girls-skirts', 'Sparkles', 3),
(4, 'School Shoes', 'الأحذية المدرسية', 'shoes', 'Footprints', 4),
(5, 'Accessories & Belts', 'الملحقات والأحزمة', 'accessories', 'Tag', 5),
(6, 'Books & Stationery', 'الكتب والقرطاسية', 'books-stationery', 'BookOpen', 6),
(7, 'School Bags', 'الحقائب المدرسية', 'school-bags', 'Backpack', 7);

-- ------------------------------------------------------------------------------
-- SEED PRODUCTS
-- ------------------------------------------------------------------------------
INSERT INTO `products` (`id`, `category_id`, `sku`, `name_en`, `name_ar`, `description_en`, `description_ar`, `base_price`, `featured`, `is_active`) VALUES
(1, 1, 'IPS-UNIF-POLO-MRN', 
 'IPS Maroon Polo Shirt', 
 'قميص بولو مدرسة الرواد (عنابي)', 
 'Official International Pioneers School uniform polo shirt. Breathable, durable cotton blend pique with official school crest and contrast gold-trimmed collar and cuffs.', 
 'قميص البولو الرسمي لمدرسة الرواد الدولية بصلالة. مصنوع من أجود خامات القطن المريحة مع شعار المدرسة الرسمي وياقة أنيقة بأطراف ذهبية.', 
 6.500, 1, 1),

(2, 2, 'IPS-UNIF-TRSR-GRY', 
 'Boys\' Gray Trousers', 
 'بنطال أولاد رمادي رسمي', 
 'Official tailored gray school trousers for boys. Wrinkle-resistant fabric with adjustable inner waistband for maximum comfort throughout the school day.', 
 'بنطال مدرسي رمادي مريح للأولاد، مقاوم للتجاعيد مع حزام خصر داخلي قابل للتعديل لتوفير أقصى درجات الراحة اليومية.', 
 7.500, 1, 1),

(3, 3, 'IPS-UNIF-SKRT-GRY', 
 'Girls\' Gray Pleated Skirt', 
 'تنورة بنات رمادية بكسرات', 
 'Official gray knife-pleated school skirt for girls featuring discrete embroidered IPS monogram, elasticated comfort waist, and durable school-grade twill.', 
 'تنورة مدرسية رمادية أنيقة بكسرات وتطريز شعار IPS مع خصر مرن مريح وقماش عالي الجودة يدوم طويلاً.', 
 7.500, 1, 1),

(4, 4, 'IPS-SHOE-BOY-BLK', 
 'Boys\' Black School Shoes', 
 'حذاء مدرسي أسود للأولاد', 
 'Genuine leather lace-up school shoes for boys. Cushioned insole, non-marking rubber outsole, and scuff-resistant toe cap designed for active school routines.', 
 'حذاء مدرسي رسمي للأولاد مصنوع من الجلد الطبيعي برباط، مزود بنعل داخلي مبطن ومقاوم للانزلاق لضمان الراحة طوال اليوم.', 
 9.500, 1, 1),

(5, 4, 'IPS-SHOE-GRL-BLK', 
 'Girls\' Black Mary Jane Shoes', 
 'حذاء ماري جين أسود للبنات', 
 'Classic school Mary Jane shoes for girls with secure hook-and-loop strap, supportive arch support, and sleek glossy finish.', 
 'حذاء ماري جين الكلاسيكي للبنات بحزام إغلاق عملي وقوس داعم للقدم مع مظهر أنيق ومريح للمدرسة.', 
 9.500, 1, 1),

(6, 5, 'IPS-ACCS-BELT-BLK', 
 'School Belt (Black)', 
 'حزام مدرسي جلدي (أسود)', 
 'Sturdy black synthetic leather school belt with classic silver-finish buckle and multiple adjustment holes.', 
 'حزام مدرسي رسمي أنيق باللون الأسود مزود بإبزيم فضي كلاسيكي متين ومناسب لجميع المقاسات.', 
 2.500, 1, 1),

(7, 5, 'IPS-ACCS-SOCK-WHT', 
 'School Socks (White)', 
 'جوارب مدرسية بيضاء (زوج)', 
 'Pack of soft, high-cotton white crew socks with reinforced heel and toe for durability and breathability.', 
 'جوارب قطنية بيضاء ناعمة ومريحة للمدرسة مع كعب ومشط معزز لمتانة تدوم مع كثرة الغسيل.', 
 1.000, 1, 1);

-- ------------------------------------------------------------------------------
-- SEED PRODUCT IMAGES
-- ------------------------------------------------------------------------------
INSERT INTO `product_images` (`product_id`, `image_url`, `alt_text`, `is_primary`, `sort_order`) VALUES
(1, '/products/polo-shirt-front.jpg', 'IPS Maroon Polo Shirt Front', 1, 1),
(1, '/products/polo-shirt-back.jpg', 'IPS Maroon Polo Shirt Back', 0, 2),
(1, '/products/polo-collar-detail.jpg', 'IPS Polo Collar Detail', 0, 3),
(1, '/products/polo-fabric-detail.jpg', 'IPS Polo Fabric Texture', 0, 4),
(2, '/products/boys-gray-trousers.jpg', 'Boys Gray Trousers', 1, 1),
(3, '/products/girls-gray-skirt.jpg', 'Girls Gray Pleated Skirt', 1, 1),
(4, '/products/boys-black-shoes.jpg', 'Boys Black School Shoes', 1, 1),
(5, '/products/girls-black-shoes.jpg', 'Girls Black Mary Jane Shoes', 1, 1),
(6, '/products/school-belt-black.jpg', 'School Belt Black', 1, 1),
(7, '/products/school-socks-white.jpg', 'School Socks White', 1, 1);

-- ------------------------------------------------------------------------------
-- SEED PRODUCT VARIANTS
-- ------------------------------------------------------------------------------
INSERT INTO `product_variants` (`id`, `product_id`, `sku`, `size`, `price_override`) VALUES
-- Polo Shirt Sizes
(1, 1, 'IPS-POLO-XS', 'XS', 6.500),
(2, 1, 'IPS-POLO-S',  'S',  6.500),
(3, 1, 'IPS-POLO-M',  'M',  6.500),
(4, 1, 'IPS-POLO-L',  'L',  6.500),
(5, 1, 'IPS-POLO-XL', 'XL', 6.500),
(6, 1, 'IPS-POLO-XXL','XXL',6.500),

-- Boys Trousers Sizes
(7, 2, 'IPS-TRSR-26', '26', 7.500),
(8, 2, 'IPS-TRSR-28', '28', 7.500),
(9, 2, 'IPS-TRSR-30', '30', 7.500),
(10, 2, 'IPS-TRSR-32', '32', 7.500),
(11, 2, 'IPS-TRSR-34', '34', 8.500),
(12, 2, 'IPS-TRSR-36', '36', 8.500),

-- Girls Skirt Sizes
(13, 3, 'IPS-SKRT-26', '26', 7.500),
(14, 3, 'IPS-SKRT-28', '28', 7.500),
(15, 3, 'IPS-SKRT-30', '30', 7.500),
(16, 3, 'IPS-SKRT-32', '32', 7.500),
(17, 3, 'IPS-SKRT-34', '34', 8.000),
(18, 3, 'IPS-SKRT-36', '36', 8.000),

-- Boys Shoes Sizes
(19, 4, 'IPS-BSHOE-32', '32', 9.500),
(20, 4, 'IPS-BSHOE-34', '34', 9.500),
(21, 4, 'IPS-BSHOE-36', '36', 9.500),
(22, 4, 'IPS-BSHOE-38', '38', 12.500),
(23, 4, 'IPS-BSHOE-40', '40', 12.500),

-- Girls Shoes Sizes
(24, 5, 'IPS-GSHOE-30', '30', 9.500),
(25, 5, 'IPS-GSHOE-32', '32', 9.500),
(26, 5, 'IPS-GSHOE-34', '34', 9.500),
(27, 5, 'IPS-GSHOE-36', '36', 12.500),
(28, 5, 'IPS-GSHOE-38', '38', 12.500),

-- Belt Size
(29, 6, 'IPS-BELT-STD', 'Standard', 2.500),

-- Socks Sizes
(30, 7, 'IPS-SOCK-S', 'S (28-33)', 1.000),
(31, 7, 'IPS-SOCK-M', 'M (34-38)', 1.000),
(32, 7, 'IPS-SOCK-L', 'L (39-44)', 1.000);

-- ------------------------------------------------------------------------------
-- SEED INVENTORY (Stock levels per variant)
-- ------------------------------------------------------------------------------
INSERT INTO `inventory` (`variant_id`, `stock_quantity`, `reserved_quantity`, `low_stock_threshold`) VALUES
(1, 45, 0, 5),
(2, 60, 0, 10),
(3, 85, 0, 10),
(4, 70, 0, 10),
(5, 50, 0, 5),
(6, 30, 0, 5),
(7, 35, 0, 5),
(8, 40, 0, 5),
(9, 55, 0, 8),
(10, 50, 0, 8),
(11, 30, 0, 5),
(12, 25, 0, 5),
(13, 35, 0, 5),
(14, 45, 0, 5),
(15, 60, 0, 8),
(16, 50, 0, 8),
(17, 30, 0, 5),
(18, 20, 0, 5),
(19, 25, 0, 5),
(20, 30, 0, 5),
(21, 35, 0, 5),
(22, 25, 0, 5),
(23, 20, 0, 5),
(24, 25, 0, 5),
(25, 30, 0, 5),
(26, 35, 0, 5),
(27, 25, 0, 5),
(28, 20, 0, 5),
(29, 120, 0, 15),
(30, 150, 0, 20),
(31, 200, 0, 20),
(32, 140, 0, 15);

