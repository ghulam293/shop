# MariaDB / MySQL Database Design — Shop

Database Name: `shop`  
Collation: `utf8mb4_unicode_ci` (Full Unicode support for English & Arabic)

---

## 1. Relational Structure Overview (14 Normalized Tables)

```
users
  ├── user_roles ──── roles
  ├── carts ──── cart_items ──── product_variants ──── products ──── categories
  │                                    │                      └── product_images
  │                                    └── inventory
  ├── orders ──── order_items ──── product_variants
  ├── notifications
  └── audit_logs
```

---

## 2. Table Summary

| Table | Purpose | Key Constraints & Properties |
| :--- | :--- | :--- |
| `users` | Customers, Managers, and Administrators | Email uniqueness, Argon2id hash storage, MFA columns |
| `roles` | System roles (`ADMIN`, `STORE_MANAGER`, `CUSTOMER`) | Unique role names |
| `user_roles` | Many-to-many user-to-role mappings | Composite primary key `(user_id, role_id)` |
| `categories` | Bilingual product categories | Unique URL slug, Arabic & English display names |
| `products` | Core catalog products | Decimal `base_price` (3 decimals for OMR, e.g. 6.500) |
| `product_images`| Clean isolated product photography | Sort order, primary flag, cascade delete on product |
| `product_variants`| Sizing and specific variant SKUs (XS, S, M, L...) | Unique SKU, size index, optional size price override |
| `inventory` | Atomic stock quantity & low-stock alerts | `CHECK (stock_quantity >= 0)`, reserved quantity logic |
| `carts` | Persistent shopping carts per user | 1-to-1 unique mapping per registered customer |
| `cart_items` | Products and selected size variant in user cart | Unique key `(cart_id, variant_id)` |
| `orders` | Placed orders with OMR financial totals | Unique order numbers (`ORD-XXXXX`), status enum |
| `order_items` | Historic snapshot of ordered items & prices | Preserves purchase price, size, and product name |
| `notifications` | In-app customer & admin notifications | Bilingual title and messages, read status tracking |
| `audit_logs` | Comprehensive security & action audit trail | JSON metadata, user ID, IP address, user agent |

---

## 3. How to Initialize the Database

### Option A: Using phpMyAdmin or MariaDB CLI
Run in PowerShell or Command Prompt:

```powershell
# 1. Create database and tables
"C:\Program Files\MariaDB 13.0\bin\mariadb.exe" -P 3307 -u root < database\schema_with_seed.sql
```
# Or with XAMPP:
"C:\xampp\mysql\bin\mysql.exe" -u root < database\schema.sql

# 2. Populate initial seed data (Categories, Official Uniforms, Variants, Stock)
"C:\Program Files\MariaDB 13.0\bin\mariadb.exe" -u root -p ips_school_shop < database\seed.sql
# Or with XAMPP:
"C:\xampp\mysql\bin\mysql.exe" -u root ips_school_shop < database\seed.sql
```

### Option B: Using phpMyAdmin
1. Open `http://localhost/phpmyadmin` in your browser.
2. Click **Import**.
3. Choose `database/schema.sql` and click **Go**.
4. Choose `database/seed.sql` and click **Go**.

---

## 4. Decimal Currency Standards for Omani Rial (OMR)

All monetary fields are declared with `DECIMAL(10,3)` to strictly support the 3-decimal subdivisions of Omani Rial (Baisa):
- `6.500 OMR` (Maroon Polo Shirt)
- `7.500 OMR` (Boys' Gray Trousers)
- `7.500 OMR` (Girls' Gray Skirt)
- `9.500 OMR` (School Shoes)
- `2.500 OMR` (Black Belt)
- `1.000 OMR` (White Socks)

