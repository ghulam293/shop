-- ==============================================================================
-- DATABASE MIGRATION: PAYMENT MANAGEMENT SYSTEM
-- TARGET: shop database
-- CURRENCY: OMR (Omani Rial - DECIMAL(10,3))
-- ==============================================================================

USE `shop`;

-- ------------------------------------------------------------------------------
-- 1. PAYMENT ACCOUNTS TABLE (Configurable Gateways: OmanNet, Visa/Mastercard)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payment_accounts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `gateway_name` VARCHAR(100) NOT NULL,
  `gateway_slug` VARCHAR(50) NOT NULL UNIQUE,
  `merchant_id` VARCHAR(100) NOT NULL,
  `encrypted_credentials` TEXT NOT NULL,
  `environment` ENUM('Sandbox', 'Live') NOT NULL DEFAULT 'Sandbox',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `callback_url` VARCHAR(255) NULL,
  `webhook_url` VARCHAR(255) NULL,
  `notes` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_payment_accounts_slug` (`gateway_slug`),
  INDEX `idx_payment_accounts_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. PAYMENT TRANSACTIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payment_transactions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `transaction_id` VARCHAR(100) NOT NULL UNIQUE,
  `order_id` INT UNSIGNED NOT NULL,
  `order_number` VARCHAR(50) NOT NULL,
  `customer_id` INT UNSIGNED NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_email` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(50) NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL, -- 'DEBIT_CARD_OMANNET', 'CREDIT_CARD_VISA', 'CREDIT_CARD_MASTERCARD', 'CASH_ON_DELIVERY'
  `gateway_name` VARCHAR(100) NOT NULL, -- 'OmanNet', 'CyberSource', 'CashOnDelivery'
  `gateway_reference` VARCHAR(150) NULL,
  `amount` DECIMAL(10,3) NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'OMR',
  `payment_status` ENUM('Pending', 'Processing', 'Paid', 'Failed', 'Cancelled', 'Refunded', 'Partially Refunded') NOT NULL DEFAULT 'Pending',
  `gateway_response_reference` TEXT NULL,
  `card_brand` VARCHAR(50) NULL, -- 'OmanNet', 'Visa', 'Mastercard'
  `card_last4` VARCHAR(4) NULL,
  `idempotency_key` VARCHAR(150) NULL UNIQUE,
  `paid_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_pay_tx_order` (`order_id`),
  INDEX `idx_pay_tx_number` (`order_number`),
  INDEX `idx_pay_tx_status` (`payment_status`),
  INDEX `idx_pay_tx_method` (`payment_method`),
  INDEX `idx_pay_tx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. PAYMENT WEBHOOK LOGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payment_webhook_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `gateway_name` VARCHAR(100) NOT NULL,
  `event_id` VARCHAR(100) NOT NULL,
  `transaction_id` VARCHAR(100) NULL,
  `event_type` VARCHAR(100) NOT NULL,
  `processing_status` VARCHAR(50) NOT NULL DEFAULT 'SUCCESS',
  `payload` JSON NULL,
  `signature` VARCHAR(255) NULL,
  `received_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_webhook_tx` (`transaction_id`),
  INDEX `idx_webhook_event` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. REFUNDS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `refunds` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `refund_id` VARCHAR(100) NOT NULL UNIQUE,
  `transaction_id` VARCHAR(100) NOT NULL,
  `order_id` INT UNSIGNED NOT NULL,
  `order_number` VARCHAR(50) NOT NULL,
  `refund_amount` DECIMAL(10,3) NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'OMR',
  `refund_status` ENUM('Pending', 'Completed', 'Failed') NOT NULL DEFAULT 'Completed',
  `reason` VARCHAR(255) NOT NULL,
  `gateway_reference` VARCHAR(150) NULL,
  `admin_id` INT UNSIGNED NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_refund_tx` (`transaction_id`),
  INDEX `idx_refund_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. PAYMENT AUDIT LOGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payment_audit_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `admin_id` INT UNSIGNED NULL,
  `admin_email` VARCHAR(150) NULL,
  `action` VARCHAR(100) NOT NULL,
  `transaction_id` VARCHAR(100) NULL,
  `description` TEXT NOT NULL,
  `ip_address` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_audit_tx` (`transaction_id`),
  INDEX `idx_audit_action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. SEED DEFAULT PAYMENT GATEWAYS (OmanNet, Visa/Mastercard, COD)
-- ------------------------------------------------------------------------------
INSERT IGNORE INTO `payment_accounts` 
(`id`, `gateway_name`, `gateway_slug`, `merchant_id`, `encrypted_credentials`, `environment`, `is_active`, `callback_url`, `webhook_url`, `notes`)
VALUES
(1, 'OmanNet Payment Gateway', 'omannet', 'OMN_MERCHANT_968001', 'ENC:AES256GCM:968_OMN_SEC_KEY_PROD_VERIFIED', 'Sandbox', 1, 'https://shop-kprm.vercel.app/payment/omannet/callback', 'https://shop-kprm.vercel.app/api/payments/webhook/omannet', 'Official OmanNet National Debit Switch (Central Bank of Oman)'),
(2, 'Visa / Mastercard Gateway (CyberSource)', 'cybersource', 'CYB_MERCH_772199', 'ENC:AES256GCM:CYB_API_KEY_SECURE_TOKEN_2026', 'Sandbox', 1, 'https://shop-kprm.vercel.app/payment/card/callback', 'https://shop-kprm.vercel.app/api/payments/webhook/cybersource', 'Global Visa & Mastercard 3D-Secure 2.0 Card Gateway'),
(3, 'Cash on Delivery (COD)', 'cod', 'STORE_COD_OMAN', 'ENC:AES256GCM:DIRECT_COD_NO_GATEWAY_REQUIRED', 'Live', 1, 'https://shop-kprm.vercel.app/track-order', 'https://shop-kprm.vercel.app/api/payments/webhook/cod', 'Direct cash collection by logistics courier upon arrival');
