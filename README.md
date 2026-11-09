# IPS Oman School Shopping System
### International Pioneers School (Salalah), Sultanate of Oman

Official e-commerce and uniform provisioning platform for International Pioneers School (Salalah).

---

## 1. System Overview

- **Platform:** Responsive Web Application + Android Mobile APK (Capacitor)
- **Currency:** Omani Rial (OMR — 3 Decimal Precision: e.g. `6.500 OMR`)
- **Languages:** English (LTR) & Arabic (RTL) with Cairo & Inter web typography
- **Design Theme:** Deep Maroon (`#800020`), Gold (`#D4AF37`), White (`#FFFFFF`), Charcoal (`#222222`)
- **Database:** MariaDB (`ips_school_shop`) on port `3307`
- **Password Security:** Argon2id hashing
- **Android Package:** `com.ipsoman.schoolshop`

---

## 2. Default Administrative & Parent Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **School Administrator** | `admin@ipsoman.com` | `Admin@IPS2026!` | Full dashboard (`/admin`), order fulfillment status updates, live inventory adjustments, sales reports |
| **Parent Demo** | `parent@ipsoman.com` | `Parent@2026!` | Storefront browsing, size selection, shopping cart, campus pickup checkout, order tracking |

---

## 3. Quick Start Guide

### Step 1: Start the Backend Server
```powershell
cd "c:\Users\Ghulam Hussain\Desktop\shop\backend"
npm start
```
*API runs on `http://localhost:5000` and automatically connects to MariaDB on `127.0.0.1:3307`.*

### Step 2: Start the React Frontend
```powershell
cd "c:\Users\Ghulam Hussain\Desktop\shop\frontend"
npm run dev
```
*Open `http://localhost:3000` in your browser.*

---

## 4. Android APK Generation (Capacitor)

The native Android project is generated in [`frontend/android/`](file:///c:/Users/Ghulam%20Hussain/Desktop/shop/frontend/android) with:
- **Application Name:** `IPS Oman School Shop`
- **Application ID:** `com.ipsoman.schoolshop`
- **App Icons:** Configured with official IPS School Crest (`ic_launcher.png`) across all mipmap densities.

### To build the release APK or run in Android Studio:
```powershell
cd "c:\Users\Ghulam Hussain\Desktop\shop\frontend"

# Build web assets and sync to native Android
npm run build
npx cap sync

# Open project in Android Studio
npx cap open android
```

In **Android Studio**:
1. Click **Build** > **Generate Signed Bundle / APK**.
2. Select **APK** (or **Android App Bundle** for Google Play Store publication).
3. Create or select your release keystore.
4. Select `release` build variant and click **Finish**.
5. Your signed APK will be generated in `frontend/android/app/release/app-release.apk`.

---

## 5. Official Uniform Catalog & Pricing (OMR)

| Product | Base Price | Available Sizes | SKUs |
| :--- | :--- | :--- | :--- |
| **IPS Maroon Polo Shirt** | `OMR 6.500` | XS, S, M, L, XL, XXL | `IPS-POLO-XS` to `XXL` |
| **Boys' Gray Trousers** | `OMR 7.500` / `8.500` | 26, 28, 30, 32, 34, 36 | `IPS-TRSR-26` to `36` |
| **Girls' Gray Pleated Skirt** | `OMR 7.500` / `8.000` | 26, 28, 30, 32, 34, 36 | `IPS-SKRT-26` to `36` |
| **Boys' Black School Shoes** | `OMR 9.500` / `12.500` | 32, 34, 36, 38, 40, 42 | `IPS-BSHOE-32` to `42` |
| **Girls' Mary Jane Shoes** | `OMR 9.500` / `12.500` | 30, 32, 34, 36, 38, 40 | `IPS-GSHOE-30` to `40` |
| **School Belt (Black)** | `OMR 2.500` | Standard | `IPS-BELT-STD` |
| **School Socks (White)** | `OMR 1.000` | S (28-33), M (34-38), L (39-44) | `IPS-SOCK-S` to `L` |

