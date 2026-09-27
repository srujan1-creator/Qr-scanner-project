# QR Studio — QR Code Generator & Designer

> **GDG on Campus SRM — Technical Domain Recruitment Project**  
> A complete, 100% browser-based React + Vite web application for generating, customizing, validating, and exporting standard-compliant QR codes in real time.

---

## Project Description

**QR Studio** is a modern, responsive, frontend-only web application engineered with **React 18** and **Vite**. It enables developers, students, and organizers to generate scannable QR codes across five distinct payload formats (**URL**, **Plain Text**, **Email**, **Phone Number**, and **Wi-Fi**) without any server round-trips or external API dependencies.

Every input change, visual preset selection, color tweak, and error-correction adjustment renders **instantly in real time** while continuously checking **WCAG 2.1 contrast ratios** and scan reliability to prevent unreadable QR codes.

---

## Features

- **5 Standard QR Content Types:** URL, Plain Text, Email (`mailto:`), Phone (`tel:`), and Wi-Fi (`WIFI:`) with proper character escaping and URI encoding.
- **Zero-Click Real-Time Generation:** The live QR canvas updates immediately as you type or adjust controls—no "Generate" button needed.
- **Full Visual Customization:** Adjust QR resolution (`140px`–`512px`), Foreground & Background hex colors (with one-click color swap), Error Correction Level (`L`, `M`, `Q`, `H`), and Quiet Zone Margin (`0`–`8` modules).
- **One-Click Visual Presets:** Choose from *Classic*, *Dark*, *Light*, *Ocean*, *Minimal*, and *Emerald* presets—and continue customizing freely afterward.
- **Scan Reliability & Contrast Protection:** Real-time WCAG 2.1 relative luminance and contrast ratio calculator warns whenever foreground/background contrast is low (`< 4.5:1`), colors are inverted, or quiet zones are too narrow.
- **Instant Export & Clipboard Support:**
  - **Download PNG** with semantic filenames (`qr-studio-url.png`, `qr-studio-wifi.png`, etc.).
  - **Copy QR** directly to the system clipboard (copies PNG image blob via `ClipboardItem` with automatic fallback to payload text).
- **Persistent Recent QR Codes (`localStorage`):** Automatically stores up to 10 recent QR configurations (including thumbnail, input data, preset, customization settings, and timestamp) that survive page refreshes, complete with **Reuse** and **Delete** actions.
- **Light & Dark Theme Support:** Polished dual-theme interface persisted in `localStorage`.
- **Accessible & Responsive:** Built with semantic landmarks, ARIA attributes, keyboard focus states, and fluid layouts tested from `320px` mobile screens to `1440px+` desktops.

---

## Technologies Used

| Category | Technology |
| :--- | :--- |
| **UI Framework** | React 18 (`react`, `react-dom`) |
| **Build Tool & Bundler** | Vite 5 (`@vitejs/plugin-react`) |
| **Language** | Modern JavaScript (ES2022+ / JSX) |
| **QR Generation Engine** | `qrcode` (ISO/IEC 18004 client-side Canvas/DataURL encoder) |
| **Icons** | `lucide-react` |
| **Styling** | Custom Modular CSS3 with CSS Custom Properties (Light & Dark Themes) |
| **Persistence** | Browser `localStorage` with fault-tolerant wrappers |
| **Deployment** | Vercel / Netlify SPA Ready (`vercel.json` included) |

---

## QR Types Supported

1. **URL (`https://`)**
   - Automatically normalizes domains (e.g. `gdg.community.dev` → `https://gdg.community.dev`) and validates hostname structure.
2. **Plain Text**
   - Supports multiline notes, event descriptions, or snippets up to 1,200 characters with a live character counter.
3. **Email (`mailto:`)**
   - Encodes recipient email address, subject line, and message body into a RFC 6068 compliant `mailto:user@example.com?subject=...&body=...` URI.
4. **Phone Number (`tel:`)**
   - Formats international and local numbers into `tel:+919876543210` payloads for instant one-tap dialing.
5. **Wi-Fi (`WIFI:`)**
   - Generates ZXing-compliant payloads (`WIFI:T:WPA;S:NetworkName;P:Password;H:true;;`) supporting `WPA/WPA2/WPA3`, `WEP`, and `None` (Open) encryption plus Hidden SSID flags, escaping special characters (`\`, `;`, `,`, `"`, `:`).

---

## Customization Features

- **QR Size:** Adjustable slider from `140 × 140 px` to `512 × 512 px` (default `280 × 280 px`).
- **Foreground & Background Colors:** Synchronized native color pickers + editable `#HEX` inputs + quick swap button.
- **Error Correction Levels:**
  - `L` — Low (~7% recovery)
  - `M` — Medium (~15% recovery, default)
  - `Q` — Quartile (~25% recovery)
  - `H` — High (~30% recovery)
- **Quiet Zone Margin:** Adjustable from `0` to `8` modules (default `4`).
- **Visual Presets:** *Classic*, *Dark*, *Light*, *Ocean*, *Minimal*, and *Emerald*.
- **Reset Button:** Restores all customization settings to defaults in a single click.

---

## Local Storage

QR Studio persists two keys in `window.localStorage`:
- `qr_studio_recent_items_v1`: Stores up to **10** recently generated QR codes, including `id`, `type`, `inputData`, `customization`, `presetId`, `payload`, `summary`, `thumbnail`, and `createdAt` timestamp.
- `qr_studio_theme_v1`: Persists the user's selected theme (`light` or `dark`).

All `localStorage` calls are wrapped in `try/catch` blocks inside `src/utils/qrStorage.js` so restricted browsing modes never crash the application.

---

## Validation

Client-side validation is handled in `src/utils/validation.js` and rendered via accessible `<ValidationMessage />` alerts (`role="alert"`):
- **URL:** Rejects empty strings, spaces, unsupported protocols, and malformed domain names.
- **Plain Text:** Rejects empty/whitespace-only inputs and warns if text exceeds 1,200 characters.
- **Email:** Validates standard `user@domain.tld` syntax and checks subject/body lengths.
- **Phone:** Validates allowed phone characters and ensures 7 to 15 numeric digits.
- **Wi-Fi:** Requires non-empty SSID (`1–32` chars) and enforces valid password lengths for `WPA` (`8–63` chars) and `WEP` (`5+` chars) while disabling password requirements for open (`None`) networks.

---

## Responsive Design

Tested across standard device breakpoints with zero horizontal scrolling:
- **Mobile Small:** `320px`
- **Mobile Standard:** `375px`
- **Tablet:** `768px`
- **Laptop:** `1024px`
- **Desktop Wide:** `1440px+`

On Desktop (`> 1040px`), the workspace displays a two-column split layout with a sticky right-hand **Live QR Preview**. On Tablet and Mobile (`<= 1040px`), panels stack vertically with full-width touch-friendly controls.

---

## Project Structure

```text
qr-studio/
├── public/
│   └── favicon.svg
├── screenshots/
│   └── README.md
├── src/
│   ├── components/
│   │   ├── EmailForm.jsx
│   │   ├── Header.jsx
│   │   ├── PhoneForm.jsx
│   │   ├── Presets.jsx
│   │   ├── QRCustomizer.jsx
│   │   ├── QRForm.jsx
│   │   ├── QRPreview.jsx
│   │   ├── QRTypeSelector.jsx
│   │   ├── RecentQRCodes.jsx
│   │   ├── TextForm.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── URLForm.jsx
│   │   ├── ValidationMessage.jsx
│   │   └── WifiForm.jsx
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   └── useQRCode.js
│   ├── styles/
│   │   └── index.css
│   ├── utils/
│   │   ├── contrast.js
│   │   ├── qrPayload.js
│   │   ├── qrStorage.js
│   │   └── validation.js
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── vercel.json
├── vite.config.js
└── README.md
```

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/srujan1-creator/Qr-scanner-project.git
   cd Qr-scanner-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## Build

To create an optimized production bundle in the `dist/` folder:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Deployment

### Deploying to Vercel (Recommended)
1. Push this repository to **GitHub**.
2. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repository.
3. Vercel automatically detects **Vite**:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**. Your live production URL will be ready in ~30 seconds.

### Deploying to Netlify
1. Push this repository to **GitHub**.
2. In Netlify, click **Add new site → Import an existing project**.
3. Set **Build command** to `npm run build` and **Publish directory** to `dist`.
4. Click **Deploy site**.

---

## Screenshots

Save your screenshots inside the [`screenshots/`](./screenshots/) folder using the filenames below:

- **Desktop Home (`screenshots/desktop-home.png`)**  
  ![Desktop Home](./screenshots/desktop-home.png)
- **URL QR (`screenshots/url-qr.png`)**  
  ![URL QR](./screenshots/url-qr.png)
- **Email QR (`screenshots/email-qr.png`)**  
  ![Email QR](./screenshots/email-qr.png)
- **Wi-Fi QR (`screenshots/wifi-qr.png`)**  
  ![Wi-Fi QR](./screenshots/wifi-qr.png)
- **Customization & Presets (`screenshots/customization.png`)**  
  ![Customization](./screenshots/customization.png)
- **Recent QR Codes (`screenshots/recent-qr-codes.png`)**  
  ![Recent QR Codes](./screenshots/recent-qr-codes.png)
- **Mobile View (`screenshots/mobile-view.png`)**  
  ![Mobile View](./screenshots/mobile-view.png)
- **Dark Mode (`screenshots/dark-mode.png`)**  
  ![Dark Mode](./screenshots/dark-mode.png)

---

## Testing

The application was verified across the following test suite:

1. **QR Payload Generation & Encoding:**
   - Verified URL normalization (`https://gdg.community.dev`)
   - Verified Plain Text encoding and character limits
   - Verified `mailto:` URI generation with URL-encoded subject and body
   - Verified `tel:` URI formatting with country codes
   - Verified `WIFI:` ZXing format with `WPA`, `WEP`, `None` (`nopass`), hidden networks, and special character escaping
2. **Real-Time Customization & Presets:**
   - Verified instant canvas re-rendering across Size (`140px–512px`), Foreground/Background colors, ECC levels (`L`, `M`, `Q`, `H`), Margin (`0–8`), and all 6 Presets.
3. **Scan Reliability & Contrast Protection:**
   - Verified low-contrast warnings (`< 4.5:1`), critical contrast alerts (`< 2.5:1`), inverted polarity warnings, and narrow quiet-zone warnings.
4. **Export & Persistence:**
   - Verified PNG download filenames (`qr-studio-url.png`, `qr-studio-wifi.png`, etc.), clipboard copy, `localStorage` persistence of Recent QR Codes (max 10) and Theme across full page refreshes, plus Reuse and Delete workflows.
5. **Responsive Viewports:**
   - Verified layout integrity at `320px`, `375px`, `768px`, `1024px`, and `1440px`.
