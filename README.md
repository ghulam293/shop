# Shop - Modern E-Commerce Platform

Official modern e-commerce storefront, catalog, and executive dashboard platform.

---

## 1. System Overview

- **Platform:** High-Performance Responsive Web App (Vite + React) + Android Mobile App Ready (Capacitor)
- **Brand Identity:** Clean, minimalist, and luxury modern design: Deep Maroon (`#800020`), Gold (`#D4AF37`), Pure White (`#FFFFFF`), Soft Slate (`#F8FAFC`)
- **Currency:** Omani Rial (OMR — 3 Decimal Precision: e.g. `6.500 OMR`)
- **Languages:** English (LTR) & Arabic (RTL) with bilingual switching
- **Payment Gateways:**
  - **Debit / Credit Card:** Real-time interactive card input with instant live validation
  - **Cash on Delivery (COD):** Direct checkout with order placement receipt
- **Navigation:**
  - Desktop: Interactive Mega-Categories Dropdown, quick search, live cart counter, and language toggle
  - Mobile: Native bottom app navigation bar (Home, Categories, Shop, Cart, Account/Admin)
- **Executive Dashboard:**
  - Real-time revenue & sales KPI metrics (OMR revenue, order count, SKU inventory, satisfaction)
  - Daily sales performance bar chart
  - Category distribution breakdown
  - Live order management & status processing
  - Real-time inventory & stock editor with low-stock alerts
  - Customer directory & VIP spend tracking

---

## 2. Demo Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Store Administrator** | `admin@shop.com` | `admin123` | Executive dashboard (`/admin`), order status updates, live stock inventory management |
| **Customer Demo** | `demo@shop.com` | `customer123` | Browsing, cart, 1-click checkout (Card/COD), order tracking (`/orders`) |

> *Tip: You can also use the 1-click instant login buttons on the Login page.*

---

## 3. Quick Start Guide

### Frontend Development
```powershell
cd frontend
npm install
npm run dev
```
*Runs locally on `http://localhost:3000`.*

### Frontend Production Build
```powershell
npm run build
```
*Builds production assets directly into `frontend/dist`.*

---

## 4. Deploying to Vercel

When importing the GitHub repository into Vercel:

1. **Option 1 (Recommended - Direct Frontend):**
   - Click **`Import single project ->`** next to **`frontend (Vite)`**.
   - Vercel automatically sets Root Directory to `frontend`, Preset to `Vite`, and deploys instantly.

2. **Option 2 (Root Monorepo):**
   - Keep Root Directory as `./`.
   - Vercel will use the pre-configured root `vercel.json` and build command `cd frontend && npm install && npm run build`.
