-- ==============================================================================
-- DATABASE: shop (Complete Schema + Official Seeds)
-- SYSTEM: Modern Online Shopping & Catalog System
-- CHARACTER SET: utf8mb4 (Full Unicode for English & Arabic text)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `shop`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `shop`;

-- Disable foreign key checks for clean drop and create
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- CLEAN DROP ALL TABLES IN REVERSE DEPENDENCY ORDER
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `carts`;
DROP TABLE IF EXISTS `wishlists`;
DROP TABLE IF EXISTS `addresses`;
DROP TABLE IF EXISTS `inventory`;
DROP TABLE IF EXISTS `product_variants`;
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `parent_students`;
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `roles`;

-- ------------------------------------------------------------------------------
-- 1. ROLES TABLE
-- ------------------------------------------------------------------------------
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
CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `phone_number` VARCHAR(30) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `email_verified` TINYINT(1) DEFAULT 1,
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
-- 4. CATEGORIES TABLE (The 11 Curated Collections)
-- ------------------------------------------------------------------------------
CREATE TABLE `categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `number` INT NOT NULL DEFAULT 1,
  `name_en` VARCHAR(150) NOT NULL,
  `name_ar` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `group_name` VARCHAR(50) DEFAULT 'ESSENTIALS',
  `icon_name` VARCHAR(50) DEFAULT 'Package',
  `tag_en` VARCHAR(100) DEFAULT NULL,
  `tag_ar` VARCHAR(100) DEFAULT NULL,
  `display_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_categories_slug` (`slug`),
  INDEX `idx_categories_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `products` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT UNSIGNED NOT NULL,
  `sku` VARCHAR(60) NOT NULL UNIQUE,
  `name_en` VARCHAR(200) NOT NULL,
  `name_ar` VARCHAR(200) NOT NULL,
  `subtitle_en` VARCHAR(255) NULL,
  `subtitle_ar` VARCHAR(255) NULL,
  `collection_en` VARCHAR(100) NULL,
  `collection_ar` VARCHAR(100) NULL,
  `description_en` TEXT NOT NULL,
  `description_ar` TEXT NOT NULL,
  `base_price` DECIMAL(10,3) NOT NULL,
  `size_label` VARCHAR(80) DEFAULT 'Size',
  `default_size` VARCHAR(50) DEFAULT 'Standard',
  `featured` TINYINT(1) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT,
  INDEX `idx_products_sku` (`sku`),
  INDEX `idx_products_featured` (`featured`),
  INDEX `idx_products_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. PRODUCT_IMAGES TABLE
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
-- 7. PRODUCT_VARIANTS TABLE (Size Matrix)
-- ------------------------------------------------------------------------------
CREATE TABLE `product_variants` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT UNSIGNED NOT NULL,
  `sku` VARCHAR(70) NOT NULL UNIQUE,
  `size` VARCHAR(50) NOT NULL,
  `price_override` DECIMAL(10,3) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_product_variants_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  INDEX `idx_variants_product_size` (`product_id`, `size`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. INVENTORY TABLE
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
-- 9. CARTS & CART_ITEMS
-- ------------------------------------------------------------------------------
CREATE TABLE `carts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_carts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cart_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `cart_id` INT UNSIGNED NOT NULL,
  `variant_id` INT UNSIGNED NOT NULL,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_cart_variant` (`cart_id`, `variant_id`),
  CONSTRAINT `fk_cart_items_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cart_items_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 10. ORDERS & ORDER_ITEMS
-- ------------------------------------------------------------------------------
CREATE TABLE `orders` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` INT UNSIGNED NOT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(50) NOT NULL,
  `customer_email` VARCHAR(150) NOT NULL,
  `fulfillment_method` ENUM('STORE_PICKUP', 'HOME_DELIVERY') NOT NULL DEFAULT 'STORE_PICKUP',
  `delivery_address` VARCHAR(255) NULL,
  `pickup_counter` VARCHAR(100) DEFAULT 'Main Store Collection Counter (Salalah)',
  `status` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PROCESSING',
  `subtotal` DECIMAL(10,3) NOT NULL,
  `shipping_fee` DECIMAL(10,3) NOT NULL DEFAULT 0.000,
  `total_amount` DECIMAL(10,3) NOT NULL,
  `payment_method` ENUM('CARD', 'CASH_ON_DELIVERY') NOT NULL DEFAULT 'CARD',
  `payment_status` ENUM('PAID', 'PENDING', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PAID',
  `tracking_number` VARCHAR(60) NULL,
  `estimated_delivery` VARCHAR(100) NULL,
  `notes` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_orders_status` (`status`),
  INDEX `idx_orders_number` (`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL,
  `variant_id` INT UNSIGNED NOT NULL,
  `product_name` VARCHAR(200) NOT NULL,
  `size` VARCHAR(50) NOT NULL,
  `quantity` INT UNSIGNED NOT NULL,
  `unit_price` DECIMAL(10,3) NOT NULL,
  `subtotal` DECIMAL(10,3) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 11. AUDIT LOGS & NOTIFICATIONS
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
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `audit_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(50) NOT NULL,
  `entity_id` VARCHAR(50) NULL,
  `details` JSON NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_audit_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- OFFICIAL SEED DATA
-- ==============================================================================

-- Roles
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'ADMIN', 'Store administrator with full catalog, inventory, price, and order controls'),
(2, 'STORE_MANAGER', 'Store manager for counter pickup verification and stock handling'),
(3, 'CUSTOMER', 'Registered online store customer');

-- Users
INSERT INTO `users` (`id`, `full_name`, `email`, `phone_number`, `password_hash`, `is_active`, `email_verified`) VALUES
(1, 'Store Administrator', 'admin@shop.com', '+968 23 234567', '$argon2id$v=19$m=65536,t=3,p=4$V2ZsaXZlU2VjdXJlU2FsdDIwMjY$nZvhgK04/9wzFkR+mUa/i53a1Y7Mh8R5s9YhM0mH+78', 1, 1),
(2, 'Salim Al-Shanfari', 'demo@shop.com', '+968 91 234567', '$argon2id$v=19$m=65536,t=3,p=4$V2ZsaXZlU2VjdXJlU2FsdDIwMjY$dGhpcyBpcyBhIHNhbXBsZSBoYXNoIGZvciBkZW1vMTIz', 1, 1),
(3, 'Fatima Al-Kathiri', 'fatima.kathiri@gmail.com', '+968 92 345678', '$argon2id$v=19$m=65536,t=3,p=4$V2ZsaXZlU2VjdXJlU2FsdDIwMjY$dGhpcyBpcyBhIHNhbXBsZSBoYXNoIGZvciBkZW1vMTIz', 1, 1),
(4, 'Ahmed Al-Maashani', 'ahmed.maashani@gmail.com', '+968 93 456789', '$argon2id$v=19$m=65536,t=3,p=4$V2ZsaXZlU2VjdXJlU2FsdDIwMjY$dGhpcyBpcyBhIHNhbXBsZSBoYXNoIGZvciBkZW1vMTIz', 1, 1);

INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(1, 1),
(2, 3),
(3, 3),
(4, 3);

-- The 11 Curated Collections
INSERT INTO `categories` (`id`, `number`, `name_en`, `name_ar`, `slug`, `group_name`, `icon_name`, `tag_en`, `tag_ar`, `display_order`) VALUES
(1,  1,  'School Uniforms & Attire', 'الزي المدرسي والملابس', 'school-uniforms', 'CLOTHING', 'Shirt', 'Collection 01', 'التشكيلة 01', 1),
(2,  2,  'School Bags & Packs', 'الحقائب المدرسية والمستلزمات', 'school-bags', 'ESSENTIALS', 'Backpack', 'Collection 02', 'التشكيلة 02', 2),
(3,  3,  'Academic Books & Stationery', 'الكتب والقرطاسية الأكاديمية', 'stationery-books', 'STUDY', 'BookOpen', 'Collection 03', 'التشكيلة 03', 3),
(4,  4,  'Dining & Drinkware', 'علب الطعام ومطارات المشروبات', 'lunch-boxes', 'ESSENTIALS', 'Utensils', 'Collection 04', 'التشكيلة 04', 4),
(5,  5,  'Wellness & Personal Care', 'الرعاية الصحية والعناية', 'healthcare', 'HEALTH', 'HeartPulse', 'Collection 05', 'التشكيلة 05', 5),
(6,  6,  'Athletics & Sports Gear', 'اللياقة والرياضة البدنية', 'fitness-sports', 'TECH_SPORTS', 'Activity', 'Collection 06', 'التشكيلة 06', 6),
(7,  7,  'Electronics & Tech Gear', 'الإلكترونيات وملحقات التقنية', 'electronics', 'TECH_SPORTS', 'Cpu', 'Collection 07', 'التشكيلة 07', 7),
(8,  8,  'Educational & STEM Play', 'ألعاب الذكاء والتعليم', 'toys-educational', 'STUDY', 'Puzzle', 'Collection 08', 'التشكيلة 08', 8),
(9,  9,  'Fine Arts, Crafts & Gifts', 'الهدايا والأعمال الفنية', 'gifts-craft', 'STUDY', 'Palette', 'Collection 09', 'التشكيلة 09', 9),
(10, 10, 'Household Essentials', 'المستلزمات والمنظمات المنزلية', 'household', 'ESSENTIALS', 'Home', 'Collection 10', 'التشكيلة 10', 10),
(11, 11, 'Travel & Outdoor Luggage', 'السفر والرحلات الخارجية', 'travel-outdoor', 'ESSENTIALS', 'Luggage', 'Collection 11', 'التشكيلة 11', 11);

-- All 20 Products
INSERT INTO `products` (`id`, `category_id`, `sku`, `name_en`, `name_ar`, `subtitle_en`, `subtitle_ar`, `collection_en`, `collection_ar`, `description_en`, `description_ar`, `base_price`, `size_label`, `default_size`, `featured`, `is_active`) VALUES
(1, 1, 'UNIF-POLO-MRN', 'Official Polo Shirt (Maroon)', 'قميص بولو مدرسي رسمي (عنابي)', 'Official School Uniform — Maroon Polo Shirt', 'الزي المدرسي الرسمي — قميص بولو عنابي', 'Uniforms & Attire', 'الأزياء المدرسية', 'Breathable cotton pique polo shirt with contrast gold collar and reinforced stitching for daily school wear.', 'قميص بولو قطني مريح بياقة مذهبة أنيقة للمدرسة وتطريز فاخر ملائم للاستخدام اليومي.', 6.000, 'Shirt Size', 'M', 1, 1),
(2, 1, 'UNIF-TRSR-GRY', 'Boys\' Formal Trousers (Gray)', 'بنطال رمادي رسمي للأولاد', 'Official School Uniform — Regular Fit Trousers', 'الزي المدرسي الرسمي — بنطال رمادي مريح للأولاد', 'Formal Attire', 'الأزياء المدرسية', 'Regular fit durable school trousers with adjustable waist and wrinkle resistance.', 'بنطال مدرسي رمادي مريح للأولاد بخياطة متينة ومقاس مريح مع خصر داخلي قابل للتعديل.', 8.500, 'Waist Size (Inches)', '30', 1, 1),
(3, 1, 'UNIF-SKRT-GRY', 'Girls\' Pleated Skirt (Gray)', 'تنورة رمادية بكسرات للبنات', 'Official School Uniform — Pleated Skirt', 'الزي المدرسي الرسمي — تنورة بكسرات أنيقة للبنات', 'Classic Uniform', 'الأزياء المدرسية', 'Comfortable classic pleated school skirt with wrinkle resistance and flexible elastic waist.', 'تنورة مدرسية مريحة بكسرات أنيقة وقماش متين مقاوم للتجعد مع خصر مرن.', 8.000, 'Waist Size (Inches)', '28', 1, 1),
(4, 1, 'SHOE-BOY-BLK', 'Boys\' Oxford Shoes (Black Leather)', 'حذاء جلدي رسمي أسود للأولاد', 'Genuine Leather Lace-up School Shoes', 'حذاء جلدي برباط للأولاد بنعل طبي', 'Footwear Collection', 'تشكيلة الأحذية', 'Genuine scuff-resistant leather with non-marking rubber outsole and cushioned arch support.', 'حذاء جلدي متين ومريح للأولاد للمدرسة بنعل طبي مانع للانزلاق ومقاوم للاحتكاك.', 12.500, 'Shoe Size (EU)', '36', 1, 1),
(5, 1, 'SHOE-GRL-BLK', 'Girls\' Mary Jane Shoes (Black)', 'حذاء ماري جين أسود للبنات', 'Classic Mary Jane Buckle Shoes', 'حذاء ماري جين كلاسيكي للبنات بحزام مريح', 'Footwear Collection', 'تشكيلة الأحذية', 'Classic Mary Jane leather shoe with supportive arch insole and easy velcro strap.', 'حذاء كلاسيكي أنيق ومريح للبنات للمدرسة بحزام مريح ونعل داخلي يدعم القدم.', 12.500, 'Shoe Size (EU)', '34', 1, 1),
(6, 1, 'ACCS-BELT-SET', 'Official Uniform Belt & Accessories', 'حزام مدرسي جلدي وإكسسوارات', 'Adjustable Leather Belt with Silver Buckle', 'حزام جلدي أسود بإبزيم فضي كلاسيكي', 'Accessories', 'إكسسوارات الزي', 'Sturdy black synthetic leather belt with polished silver buckle and adjustable holes.', 'حزام جلدي أسود أنيق قابل للتعديل ومتين لجميع الأعمار بإبزيم معدني مصقول.', 2.500, 'Belt Size', 'Standard (Adjustable)', 0, 1),
(7, 1, 'ACCS-SOCK-WHT', 'Cotton School Socks (White Pair)', 'جوارب مدرسية بيضاء قطنية (زوج)', 'Cotton Crew School Socks', 'جوارب قطنية بيضاء ناعمة', 'Accessories', 'إكسسوارات الزي', 'Breathable combed cotton socks with reinforced heel and toe for school durability.', 'جوارب قطنية ناعمة ومتينة تدوم طويلاً مع الغسيل المتكرر وتوفر راحة طوال اليوم.', 1.000, 'Sock Size', 'M (34-38)', 0, 1),
(8, 3, 'BOOK-ENG-P1', 'Cambridge Primary English Learner\'s Book', 'كتاب كامبريدج للغة الإنجليزية (الابتدائي)', 'Cambridge Primary English Curriculum', 'المنهاج المعتمد — كامبريدج للغة الإنجليزية', 'Academic & Books', 'الكتب الأكاديمية', 'Official Cambridge curriculum textbook for English learners with exercises and reading texts.', 'كتاب الطالب المعتمد لمنهاج كامبريدج الدولي للغة الإنجليزية مع أنشطة وتمارين.', 7.500, 'Curriculum Stage', 'Stage 3', 1, 1),
(9, 3, 'BOOK-MTH-P1', 'Cambridge Primary Mathematics Learner\'s Book', 'كتاب كامبريدج للرياضيات (الابتدائي)', 'Cambridge Primary Mathematics Curriculum', 'المنهاج المعتمد — كامبريدج للرياضيات', 'Academic & Books', 'الكتب الأكاديمية', 'Official Cambridge curriculum textbook for Mathematics covering arithmetic, geometry, and problem solving.', 'كتاب الرياضيات المعتمد لمنهاج كامبريدج للتعليم الأساسي لتنمية التفكير الحسابي والهندسي.', 7.500, 'Curriculum Stage', 'Stage 3', 1, 1),
(10, 3, 'BOOK-ARB-P1', 'Arabic Language Curriculum Textbook', 'كتاب لغتي الجميلة — منهاج اللغة العربية', 'Official Arabic Language Curriculum Textbook', 'المنهاج المعتمد — كتاب اللغة العربية والقراءة', 'Academic & Books', 'الكتب الأكاديمية', 'Official curriculum Arabic textbook for grammar, reading, vocabulary, and composition.', 'كتاب اللغة العربية المعتمد للقراءة والنحو والإملاء والتعبير البلاغي.', 6.500, 'Grade Level', 'Grade 4-6', 0, 1),
(11, 3, 'BOOK-SCI-P1', 'Cambridge Primary Science Textbook', 'كتاب كامبريدج للعلوم العامة والاكتشاف', 'Cambridge Primary Science Curriculum', 'المنهاج المعتمد — كامبريدج للعلوم والاكتشاف', 'Academic & Books', 'الكتب الأكاديمية', 'Official Science learner textbook with practical investigations, scientific models, and discoveries.', 'كتاب العلوم والتجارب المعتمد لمنهاج كامبريدج الدولي لدراسة الأحياء والكيمياء والفيزياء.', 7.500, 'Curriculum Stage', 'Stage 4', 0, 1),
(12, 2, 'BAG-SPINE-MRN', 'Ergonomic Spine-Support School Backpack', 'حقيبة مدرسية طبية مريحة مع مقلمة', 'Orthopedic Multi-Compartment School Backpack', 'حقيبة ظهر طبية مبطنة لدعم العمود الفقري ومقاومة للماء', 'School Bags', 'الحقائب المدرسية', 'Multi-compartment water-resistant backpack with laptop sleeve, spine support, and pencil case.', 'حقيبة ظهر طبية مريحة مبطنة لدعم العمود الفقري ومقاومة للماء مع مقلمة مطابقة وحافظة لابتوب.', 14.500, 'Backpack Size', 'Senior (Grades 5-12)', 1, 1),
(13, 4, 'LUNCH-BENTO-SET', 'Thermal Bento Lunch Box & Water Bottle Set', 'طقم حافظة طعام ومطارة ماء عازلة للحرارة', 'BPA-Free Food Grade Thermal Bento Set', 'حافظة طعام ومطارة ستانلس ستيل عازلة للحرارة', 'Dining & Drinkware', 'المستلزمات اليومية', 'BPA-free leakproof lunch container with stainless steel insulated bottle to keep food warm/cold.', 'حافظة طعام مانعة للتسرب صحية مع مطارة ماء ستانلس ستيل عازلة تحفظ المشروبات باردة أو ساخنة.', 5.500, 'Capacity Size', 'Standard (750ml)', 0, 1),
(14, 5, 'HLTH-KIT-DIGI', 'Comprehensive First-Aid & Hygiene Care Kit', 'حقيبة الإسعافات الأولية ومستلزمات العناية', 'School & Daily Healthcare Kit', 'طقم متكامل للإسعافات وميزان حرارة إلكتروني', 'Wellness & Care', 'العناية والصحة', 'Complete first-aid kit with infrared touchless thermometer, sanitizers, and antiseptic dressings.', 'طقم متكامل للإسعافات الأولية، ميزان حرارة إلكتروني ومعقمات طبية وضمادات مجهزة بالكامل.', 6.800, 'Kit Type', 'Standard Kit', 0, 1),
(15, 6, 'SPRT-TRAIN-SET', 'Athletics Training Dumbbells & Sports Gear', 'أثقال تدريب رياضية ومستلزمات اللياقة', 'PE Training & Fitness Equipment Set', 'أثقال تدريب نيوبرين وحبل قفز وكرة رياضية', 'Athletics & Sports', 'اللياقة والرياضة', 'Neoprene coated dumbbells, high-speed skipping rope, and athletic ball for sports exercises.', 'أثقال تدريب مغلفة بالنيوبرين، حبل قفز سريع وكرة رياضية لحصص التربية البدنية والتدريب.', 11.500, 'Weight Spec', '3kg Pair', 0, 1),
(16, 7, 'ELEC-CALC-FAST', 'Scientific Calculator & Fast Charging Tech Kit', 'آلة حاسبة علمية وطقم شحن سريع وكابلات', 'Exam Standard Calculator & Charging Accessories', 'آلة حاسبة علمية معتمدة للاختبارات وشاحن سريع', 'Electronics & Tech', 'الإلكترونيات والتقنية', 'Approved scientific calculator, USB-C braided fast charging cable, and portable backup power accessory.', 'آلة حاسبة علمية معتمدة للاختبارات وشاحن سريع وبطارية طوارئ وكابل مقاوم للقطع.', 8.500, 'Specification', 'Exam Standard', 0, 1),
(17, 8, 'TOYS-STEM-BLKS', 'STEM Science Experiment Kit & Wooden Puzzles', 'طقم تجارب علمية STEM ومكعبات تعليمية', 'Hands-on Learning STEM Experiments', 'أنشطة وتجارب علمية ممتعة ومكعبات ذكاء', 'Educational & STEM', 'التعليم والذكاء', 'Hands-on learning science kit with geometric puzzle blocks and physics discovery experiments.', 'طقم أنشطة وتجارب علمية ممتعة مع مكعبات ذكاء للأطفال لتنمية مهارات التفكير والاستكشاف.', 9.500, 'Target Age', 'Age 8-14', 0, 1),
(18, 9, 'ART-PALET-KIT', 'Artist Acrylic Palette & Craft Painting Set', 'طقم ألوان وفراشي رسم وأشغال فنية يدوية', 'Fine Arts Paint Tubes & Wooden Palette', 'ألوان فاخرة ناصعة مع باليتة خشبية ومجموعة فراشي', 'Fine Arts & Gifts', 'الفنون والهدايا', 'Rich pigment paint tubes, wooden mixing palette, and assorted fine artist brushes for creative school projects.', 'ألوان رسم ناصعة مع باليتة خشبية ومجموعة فراشي احترافية مناسبة لحصص الرسم والأنشطة الإبداعية.', 4.800, 'Palette Size', '24-Color Set', 0, 1),
(19, 10, 'HOME-STOR-ORGN', 'Multipurpose Home & Study Storage Organizers', 'صناديق تنظيم وترتيب منزلية ومكتبية', 'Stackable Transparent Storage Boxes', 'صناديق ترتيب أنيقة ومتينة للمنزل والمكتب', 'Home Essentials', 'المستلزمات المنزلية', 'Stackable transparent storage boxes with handle dispensers for desks, home organizers, and school books.', 'صناديق ترتيب أنيقة ومتينة للمنزل والمكتب بأحجام متعددة وتنظيم متناسق للأدوات والكتب.', 5.200, 'Storage Size', 'Medium 3-Pack', 0, 1),
(20, 11, 'TRVL-DUFF-BAG', 'Waterproof Travel Luggage Duffel & Outdoor Bag', 'حقيبة سفر ورحلات خارجية متينة مقاومة للماء', 'Heavy Duty Adventure Duffel Bag', 'حقيبة سفر ورحلات خارجية متينة مع منظمات مدمجة', 'Travel & Outdoor', 'السفر والرحلات', 'Durable water-repellent adventure luggage bag with reinforced straps, heavy zippers, and shoe compartments.', 'حقيبة سفر متينة مقاومة للماء مع جيوب تنظيم واسعة وسحابات معززة لرحلات التخييم والأنشطة.', 13.000, 'Capacity Size', 'Large (45L)', 0, 1);

-- Product Images
INSERT INTO `product_images` (`product_id`, `image_url`, `alt_text`, `is_primary`, `sort_order`) VALUES
(1, '/products/polo-shirt-front.jpg', 'Official Polo Shirt Front', 1, 1),
(1, '/products/polo-shirt-back.jpg', 'Official Polo Shirt Back', 0, 2),
(1, '/products/polo-collar-detail.jpg', 'Official Polo Shirt Collar Detail', 0, 3),
(1, '/products/polo-fabric-detail.jpg', 'Official Polo Shirt Fabric', 0, 4),
(2, '/products/boys-gray-trousers.jpg', 'Boys Formal Trousers', 1, 1),
(3, '/products/girls-gray-skirt.jpg', 'Girls Pleated Skirt', 1, 1),
(4, '/products/boys-black-shoes.jpg', 'Boys Oxford Shoes', 1, 1),
(5, '/products/girls-black-shoes.jpg', 'Girls Mary Jane Shoes', 1, 1),
(6, '/products/school-accessories-set.jpg', 'Uniform Belt and Accessories', 1, 1),
(7, '/products/school-socks-white.jpg', 'White School Socks', 1, 1),
(8, '/products/cambridge-english-book.jpg', 'Cambridge Primary English Book', 1, 1),
(9, '/products/cambridge-math-book.jpg', 'Cambridge Primary Math Book', 1, 1),
(10, '/products/arabic-language-book.jpg', 'Arabic Language Textbook', 1, 1),
(11, '/products/cambridge-science-book.jpg', 'Cambridge Primary Science Book', 1, 1),
(12, '/products/school-bags-accessories.jpg', 'Ergonomic School Backpack', 1, 1),
(13, '/products/lunch-boxes-drinkware.jpg', 'Thermal Bento Lunch Box and Bottle', 1, 1),
(14, '/products/healthcare-personal-care.jpg', 'First-Aid and Hygiene Kit', 1, 1),
(15, '/products/fitness-sports-equipment.jpg', 'Athletics Training Gear', 1, 1),
(16, '/products/electronics-mobile-accessories.jpg', 'Scientific Calculator and Tech Kit', 1, 1),
(17, '/products/toys-educational-products.jpg', 'STEM Experiment Kit', 1, 1),
(18, '/products/gifts-art-craft.jpg', 'Artist Palette and Craft Set', 1, 1),
(19, '/products/household-daily-essentials.jpg', 'Home Storage Organizers', 1, 1),
(20, '/products/travel-outdoor-luggage.jpg', 'Travel Luggage Duffel Bag', 1, 1);

-- Product Variants
INSERT INTO `product_variants` (`id`, `product_id`, `sku`, `size`, `price_override`) VALUES
(1, 1, 'UNIF-POLO-XS', 'XS', 6.000),
(2, 1, 'UNIF-POLO-S',  'S',  6.000),
(3, 1, 'UNIF-POLO-M',  'M',  6.000),
(4, 1, 'UNIF-POLO-L',  'L',  6.000),
(5, 1, 'UNIF-POLO-XL', 'XL', 6.000),
(6, 1, 'UNIF-POLO-XXL','XXL',6.000),
(7, 2, 'UNIF-TRSR-26', '26', 8.500),
(8, 2, 'UNIF-TRSR-28', '28', 8.500),
(9, 2, 'UNIF-TRSR-30', '30', 8.500),
(10, 2, 'UNIF-TRSR-32', '32', 8.500),
(11, 2, 'UNIF-TRSR-34', '34', 8.500),
(12, 2, 'UNIF-TRSR-36', '36', 8.500),
(13, 3, 'UNIF-SKRT-26', '26', 8.000),
(14, 3, 'UNIF-SKRT-28', '28', 8.000),
(15, 3, 'UNIF-SKRT-30', '30', 8.000),
(16, 3, 'UNIF-SKRT-32', '32', 8.000),
(17, 3, 'UNIF-SKRT-34', '34', 8.000),
(18, 3, 'UNIF-SKRT-36', '36', 8.000),
(19, 4, 'SHOE-BOY-32', '32', 12.500),
(20, 4, 'SHOE-BOY-34', '34', 12.500),
(21, 4, 'SHOE-BOY-36', '36', 12.500),
(22, 4, 'SHOE-BOY-38', '38', 12.500),
(23, 4, 'SHOE-BOY-40', '40', 12.500),
(24, 4, 'SHOE-BOY-42', '42', 12.500),
(25, 5, 'SHOE-GRL-30', '30', 12.500),
(26, 5, 'SHOE-GRL-32', '32', 12.500),
(27, 5, 'SHOE-GRL-34', '34', 12.500),
(28, 5, 'SHOE-GRL-36', '36', 12.500),
(29, 5, 'SHOE-GRL-38', '38', 12.500),
(30, 5, 'SHOE-GRL-40', '40', 12.500),
(31, 6, 'ACCS-BELT-STD', 'Standard (Adjustable)', 2.500),
(32, 7, 'ACCS-SOCK-S', 'S (28-33)', 1.000),
(33, 7, 'ACCS-SOCK-M', 'M (34-38)', 1.000),
(34, 7, 'ACCS-SOCK-L', 'L (39-44)', 1.000),
(35, 8, 'BOOK-ENG-S1', 'Stage 1', 7.500),
(36, 8, 'BOOK-ENG-S2', 'Stage 2', 7.500),
(37, 8, 'BOOK-ENG-S3', 'Stage 3', 7.500),
(38, 8, 'BOOK-ENG-S4', 'Stage 4', 7.500),
(39, 8, 'BOOK-ENG-S5', 'Stage 5', 7.500),
(40, 8, 'BOOK-ENG-S6', 'Stage 6', 7.500),
(41, 9, 'BOOK-MTH-S1', 'Stage 1', 7.500),
(42, 9, 'BOOK-MTH-S2', 'Stage 2', 7.500),
(43, 9, 'BOOK-MTH-S3', 'Stage 3', 7.500),
(44, 9, 'BOOK-MTH-S4', 'Stage 4', 7.500),
(45, 9, 'BOOK-MTH-S5', 'Stage 5', 7.500),
(46, 9, 'BOOK-MTH-S6', 'Stage 6', 7.500),
(47, 10, 'BOOK-ARB-G1', 'Grade 1-3', 6.500),
(48, 10, 'BOOK-ARB-G4', 'Grade 4-6', 6.500),
(49, 10, 'BOOK-ARB-G7', 'Grade 7-9', 6.500),
(50, 11, 'BOOK-SCI-S1', 'Stage 1', 7.500),
(51, 11, 'BOOK-SCI-S2', 'Stage 2', 7.500),
(52, 11, 'BOOK-SCI-S3', 'Stage 3', 7.500),
(53, 11, 'BOOK-SCI-S4', 'Stage 4', 7.500),
(54, 11, 'BOOK-SCI-S5', 'Stage 5', 7.500),
(55, 11, 'BOOK-SCI-S6', 'Stage 6', 7.500),
(56, 12, 'BAG-SPINE-JUN', 'Junior (Grades 1-4)', 14.500),
(57, 12, 'BAG-SPINE-SEN', 'Senior (Grades 5-12)', 14.500),
(58, 13, 'LBOX-SET-750', 'Standard (750ml)', 5.500),
(59, 13, 'LBOX-SET-1000', 'Large (1000ml)', 6.500),
(60, 14, 'HLTH-KIT-STD', 'Standard Kit', 6.800),
(61, 14, 'HLTH-KIT-DLX', 'Deluxe Family Pack', 9.500),
(62, 15, 'SPRT-DUMB-2KG', '2kg Pair', 9.500),
(63, 15, 'SPRT-DUMB-3KG', '3kg Pair', 11.500),
(64, 15, 'SPRT-DUMB-5KG', '5kg Pair', 14.500),
(65, 16, 'ELEC-KIT-STD', 'Exam Standard', 8.500),
(66, 17, 'TOYS-STEM-A4', 'Age 4-8', 9.500),
(67, 17, 'TOYS-STEM-A8', 'Age 8-14', 9.500),
(68, 18, 'ART-SET-12C', '12-Color Set', 3.500),
(69, 18, 'ART-SET-24C', '24-Color Set', 4.800),
(70, 19, 'HOME-STOR-MED', 'Medium 3-Pack', 5.200),
(71, 19, 'HOME-STOR-LRG', 'Large 2-Pack', 6.500),
(72, 20, 'TRVL-BAG-MED', 'Medium (30L)', 11.000),
(73, 20, 'TRVL-BAG-LRG', 'Large (45L)', 13.000);

-- Inventory
INSERT INTO `inventory` (`variant_id`, `stock_quantity`, `reserved_quantity`, `low_stock_threshold`) VALUES
(1, 45, 0, 10), (2, 60, 0, 10), (3, 85, 0, 15), (4, 70, 0, 10), (5, 50, 0, 10), (6, 30, 0, 10),
(7, 35, 0, 8),  (8, 40, 0, 8),  (9, 55, 0, 10), (10, 50, 0, 10), (11, 30, 0, 8), (12, 25, 0, 8),
(13, 35, 0, 8), (14, 45, 0, 8), (15, 60, 0, 10), (16, 50, 0, 10), (17, 30, 0, 8), (18, 20, 0, 8),
(19, 25, 0, 8), (20, 30, 0, 8), (21, 35, 0, 8), (22, 25, 0, 8), (23, 20, 0, 8), (24, 15, 0, 8),
(25, 20, 0, 6), (26, 25, 0, 6), (27, 28, 0, 6), (28, 22, 0, 6), (29, 18, 0, 6), (30, 12, 0, 6),
(31, 120, 0, 15),
(32, 150, 0, 25), (33, 200, 0, 25), (34, 140, 0, 25),
(35, 45, 0, 12), (36, 55, 0, 12), (37, 68, 0, 12), (38, 60, 0, 12), (39, 50, 0, 12), (40, 40, 0, 12),
(41, 50, 0, 12), (42, 60, 0, 12), (43, 74, 0, 12), (44, 65, 0, 12), (45, 55, 0, 12), (46, 45, 0, 12),
(47, 75, 0, 15), (48, 90, 0, 15), (49, 65, 0, 15),
(50, 40, 0, 12), (51, 50, 0, 12), (52, 60, 0, 12), (53, 65, 0, 12), (54, 55, 0, 12), (55, 45, 0, 12),
(56, 35, 0, 8),  (57, 40, 0, 8),
(58, 52, 0, 10), (59, 45, 0, 10),
(60, 45, 0, 8),  (61, 30, 0, 8),
(62, 25, 0, 6),  (63, 32, 0, 6), (64, 20, 0, 6),
(65, 30, 0, 8),
(66, 20, 0, 5),  (67, 25, 0, 5),
(68, 40, 0, 10), (69, 50, 0, 10),
(70, 45, 0, 8),  (71, 35, 0, 8),
(72, 25, 0, 5),  (73, 35, 0, 5);

-- Orders
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `customer_name`, `customer_phone`, `customer_email`, `fulfillment_method`, `delivery_address`, `pickup_counter`, `status`, `subtotal`, `shipping_fee`, `total_amount`, `payment_method`, `payment_status`, `tracking_number`, `estimated_delivery`, `notes`, `created_at`) VALUES
(1, 'ORD-98412', 2, 'Salim Al-Shanfari', '+968 9123 4567', 'demo@shop.com', 'STORE_PICKUP', NULL, 'Main Store Collection Counter (Salalah)', 'PROCESSING', 20.500, 0.000, 20.500, 'CARD', 'PAID', 'TRK-98412-OM', 'Today by 4:00 PM', 'Please pack with size verification label.', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(2, 'ORD-84129', 3, 'Fatima Al-Kathiri', '+968 9234 5678', 'fatima.kathiri@gmail.com', 'HOME_DELIVERY', 'Villa 44, Way 2304, Al-Saada, Salalah', NULL, 'READY_FOR_PICKUP', 14.500, 2.000, 16.500, 'CARD', 'PAID', 'TRK-84129-OM', 'Tomorrow 10:00 AM - 1:00 PM', 'Leave at gate reception if not answered.', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(3, 'ORD-73291', 4, 'Ahmed Al-Maashani', '+968 9345 6789', 'ahmed.maashani@gmail.com', 'STORE_PICKUP', NULL, 'Main Store Collection Counter (Salalah)', 'COMPLETED', 7.500, 0.000, 7.500, 'CASH_ON_DELIVERY', 'PAID', 'TRK-73291-OM', 'Completed & Collected', 'Collected at store counter.', DATE_SUB(NOW(), INTERVAL 3 DAY));

INSERT INTO `order_items` (`order_id`, `variant_id`, `product_name`, `size`, `quantity`, `unit_price`, `subtotal`) VALUES
(1, 3, 'Official Polo Shirt (Maroon)', 'M', 2, 6.000, 12.000),
(1, 9, 'Boys\' Formal Trousers (Gray)', '30', 1, 8.500, 8.500),
(2, 57, 'Ergonomic Spine-Support School Backpack', 'Senior (Grades 5-12)', 1, 14.500, 14.500),
(3, 43, 'Cambridge Primary Mathematics Learner\'s Book', 'Stage 3', 1, 7.500, 7.500);

SET FOREIGN_KEY_CHECKS = 1;
