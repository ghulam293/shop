-- ==============================================================================
-- DATABASE: ips_school_shop (Complete Schema + Official Seeds)
-- SYSTEM: IPS Oman School Shopping System
-- SCHOOL: International Pioneers School (Salalah), Oman
-- CHARACTER SET: utf8mb4 (Full Unicode for English & Arabic text)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `ips_school_shop`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `ips_school_shop`;

SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- 1. ROLES TABLE
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. USERS TABLE
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `parent_students`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `carts`;
DROP TABLE IF EXISTS `wishlists`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `addresses`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `phone_number` VARCHAR(30) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `email_verified` TINYINT(1) DEFAULT 0,
  `mfa_secret` VARCHAR(100) NULL,
  `mfa_enabled` TINYINT(1) DEFAULT 0,
  `last_login_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_phone` (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. USER_ROLES JUNCTION TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `user_roles` (
  `user_id` INT UNSIGNED NOT NULL,
  `role_id` INT UNSIGNED NOT NULL,
  `assigned_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `role_id`),
  CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_roles_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. STUDENTS TABLE
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id_number` VARCHAR(50) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) NOT NULL,
  `grade` VARCHAR(20) NOT NULL,
  `class_section` VARCHAR(20) NOT NULL,
  `gender` ENUM('MALE', 'FEMALE') NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_students_grade` (`grade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. PARENT_STUDENTS JUNCTION TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `parent_students` (
  `parent_id` INT UNSIGNED NOT NULL,
  `student_id` INT UNSIGNED NOT NULL,
  `relationship` VARCHAR(50) DEFAULT 'Parent',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`parent_id`, `student_id`),
  CONSTRAINT `fk_parent_students_parent` FOREIGN KEY (`parent_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_parent_students_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `product_variants`;
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `inventory`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name_en` VARCHAR(100) NOT NULL,
  `name_ar` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `icon_name` VARCHAR(50) DEFAULT 'Package',
  `display_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `products` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT UNSIGNED NOT NULL,
  `sku` VARCHAR(50) NOT NULL UNIQUE,
  `name_en` VARCHAR(200) NOT NULL,
  `name_ar` VARCHAR(200) NOT NULL,
  `description_en` TEXT NOT NULL,
  `description_ar` TEXT NOT NULL,
  `base_price` DECIMAL(10,3) NOT NULL,
  `featured` TINYINT(1) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT,
  INDEX `idx_products_sku` (`sku`),
  INDEX `idx_products_featured` (`featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. PRODUCT_IMAGES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `product_images` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT UNSIGNED NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `alt_text` VARCHAR(150) NULL,
  `is_primary` TINYINT(1) DEFAULT 0,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_product_images_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  INDEX `idx_product_images_sort` (`product_id`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 9. PRODUCT_VARIANTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `product_variants` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT UNSIGNED NOT NULL,
  `sku` VARCHAR(60) NOT NULL UNIQUE,
  `size` VARCHAR(30) NOT NULL,
  `price_override` DECIMAL(10,3) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_product_variants_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  INDEX `idx_variants_product_size` (`product_id`, `size`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 10. INVENTORY TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `inventory` (
  `variant_id` INT UNSIGNED PRIMARY KEY,
  `stock_quantity` INT NOT NULL DEFAULT 0,
  `reserved_quantity` INT NOT NULL DEFAULT 0,
  `low_stock_threshold` INT NOT NULL DEFAULT 5,
  `last_restocked_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_inventory_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_inventory_stock` CHECK (`stock_quantity` >= 0),
  CONSTRAINT `chk_inventory_reserved` CHECK (`reserved_quantity` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 11. CARTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `carts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_carts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 12. CART_ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `cart_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `cart_id` INT UNSIGNED NOT NULL,
  `variant_id` INT UNSIGNED NOT NULL,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  `student_id` INT UNSIGNED NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_cart_variant_student` (`cart_id`, `variant_id`, `student_id`),
  CONSTRAINT `fk_cart_items_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cart_items_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cart_items_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 13. WISHLISTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `wishlists` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_wishlist_user_product` (`user_id`, `product_id`),
  CONSTRAINT `fk_wishlists_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wishlists_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 14. ADDRESSES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `addresses` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `recipient_name` VARCHAR(150) NOT NULL,
  `phone_number` VARCHAR(30) NOT NULL,
  `governorate` VARCHAR(100) NOT NULL DEFAULT 'Dhofar',
  `city` VARCHAR(100) NOT NULL DEFAULT 'Salalah',
  `way_or_street` VARCHAR(200) NOT NULL,
  `building_or_villa` VARCHAR(100) NOT NULL,
  `notes` VARCHAR(255) NULL,
  `is_default` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 15. ORDERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `orders` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` INT UNSIGNED NOT NULL,
  `fulfillment_method` ENUM('SCHOOL_PICKUP', 'DELIVERY') NOT NULL DEFAULT 'SCHOOL_PICKUP',
  `shipping_address_id` INT UNSIGNED NULL,
  `pickup_campus` VARCHAR(100) DEFAULT 'International Pioneers School, Salalah',
  `status` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  `subtotal` DECIMAL(10,3) NOT NULL,
  `discount_amount` DECIMAL(10,3) NOT NULL DEFAULT 0.000,
  `shipping_fee` DECIMAL(10,3) NOT NULL DEFAULT 0.000,
  `total_amount` DECIMAL(10,3) NOT NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_orders_address` FOREIGN KEY (`shipping_address_id`) REFERENCES `addresses` (`id`) ON DELETE SET NULL,
  INDEX `idx_orders_user` (`user_id`),
  INDEX `idx_orders_status` (`status`),
  INDEX `idx_orders_number` (`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 16. ORDER_ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `order_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL,
  `variant_id` INT UNSIGNED NOT NULL,
  `student_id` INT UNSIGNED NULL,
  `product_name_en` VARCHAR(200) NOT NULL,
  `product_name_ar` VARCHAR(200) NOT NULL,
  `size` VARCHAR(30) NOT NULL,
  `unit_price` DECIMAL(10,3) NOT NULL,
  `quantity` INT UNSIGNED NOT NULL,
  `subtotal` DECIMAL(10,3) NOT NULL,
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_order_items_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 17. PAYMENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `payments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL,
  `payment_method` ENUM('CREDIT_CARD', 'DEBIT_CARD', 'SCHOOL_COUNTER_CASH', 'ONLINE_GATEWAY') NOT NULL,
  `transaction_reference` VARCHAR(100) NULL,
  `amount` DECIMAL(10,3) NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'OMR',
  `status` ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  `gateway_response` TEXT NULL,
  `verified_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  INDEX `idx_payments_order` (`order_id`),
  INDEX `idx_payments_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 18. NOTIFICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `notifications` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `title_en` VARCHAR(150) NOT NULL,
  `title_ar` VARCHAR(150) NOT NULL,
  `message_en` TEXT NOT NULL,
  `message_ar` TEXT NOT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `action_url` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_notifications_user_read` (`user_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 19. AUDIT_LOGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `audit_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(50) NOT NULL,
  `entity_id` VARCHAR(50) NULL,
  `details` JSON NULL,
  `ip_address` VARCHAR(50) NULL,
  `user_agent` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_audit_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_audit_logs_action` (`action`),
  INDEX `idx_audit_logs_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- NOW SEED INITIAL DATA
-- ==============================================================================

-- SEED ROLES
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'ADMIN', 'School shop administrator with full inventory and order controls'),
(2, 'STAFF', 'School store staff for pickup verification and inventory management'),
(3, 'PARENT', 'Registered student parent or guardian');

-- SEED CATEGORIES
INSERT INTO `categories` (`id`, `name_en`, `name_ar`, `slug`, `icon_name`, `display_order`) VALUES
(1, 'School Uniforms', 'الزي المدرسي', 'uniforms', 'Shirt', 1),
(2, 'Boys\' Trousers', 'بناطيل الأولاد', 'boys-trousers', 'Scissors', 2),
(3, 'Girls\' Skirts', 'تنانير البنات', 'girls-skirts', 'Sparkles', 3),
(4, 'School Shoes', 'الأحذية المدرسية', 'shoes', 'Footprints', 4),
(5, 'Accessories & Belts', 'الملحقات والأحزمة', 'accessories', 'Tag', 5),
(6, 'Books & Stationery', 'الكتب والقرطاسية', 'books-stationery', 'BookOpen', 6),
(7, 'School Bags', 'الحقائب المدرسية', 'school-bags', 'Backpack', 7);

-- SEED PRODUCTS
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

-- SEED PRODUCT IMAGES
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

-- SEED PRODUCT VARIANTS
INSERT INTO `product_variants` (`id`, `product_id`, `sku`, `size`, `price_override`) VALUES
(1, 1, 'IPS-POLO-XS', 'XS', 6.500),
(2, 1, 'IPS-POLO-S',  'S',  6.500),
(3, 1, 'IPS-POLO-M',  'M',  6.500),
(4, 1, 'IPS-POLO-L',  'L',  6.500),
(5, 1, 'IPS-POLO-XL', 'XL', 6.500),
(6, 1, 'IPS-POLO-XXL','XXL',6.500),

(7, 2, 'IPS-TRSR-26', '26', 7.500),
(8, 2, 'IPS-TRSR-28', '28', 7.500),
(9, 2, 'IPS-TRSR-30', '30', 7.500),
(10, 2, 'IPS-TRSR-32', '32', 7.500),
(11, 2, 'IPS-TRSR-34', '34', 8.500),
(12, 2, 'IPS-TRSR-36', '36', 8.500),

(13, 3, 'IPS-SKRT-26', '26', 7.500),
(14, 3, 'IPS-SKRT-28', '28', 7.500),
(15, 3, 'IPS-SKRT-30', '30', 7.500),
(16, 3, 'IPS-SKRT-32', '32', 7.500),
(17, 3, 'IPS-SKRT-34', '34', 8.000),
(18, 3, 'IPS-SKRT-36', '36', 8.000),

(19, 4, 'IPS-BSHOE-32', '32', 9.500),
(20, 4, 'IPS-BSHOE-34', '34', 9.500),
(21, 4, 'IPS-BSHOE-36', '36', 9.500),
(22, 4, 'IPS-BSHOE-38', '38', 12.500),
(23, 4, 'IPS-BSHOE-40', '40', 12.500),

(24, 5, 'IPS-GSHOE-30', '30', 9.500),
(25, 5, 'IPS-GSHOE-32', '32', 9.500),
(26, 5, 'IPS-GSHOE-34', '34', 9.500),
(27, 5, 'IPS-GSHOE-36', '36', 12.500),
(28, 5, 'IPS-GSHOE-38', '38', 12.500),

(29, 6, 'IPS-BELT-STD', 'Standard', 2.500),

(30, 7, 'IPS-SOCK-S', 'S (28-33)', 1.000),
(31, 7, 'IPS-SOCK-M', 'M (34-38)', 1.000),
(32, 7, 'IPS-SOCK-L', 'L (39-44)', 1.000);

-- SEED INVENTORY
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

