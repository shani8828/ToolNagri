# 🛠️ ToolNagri

> **ToolNagri** is a modern, premium, and SEO-focused utility platform offering a suite of lightweight, ultra-fast, and privacy-first online tools. Designed with a clean, Notion-Light, Stripe-Documentation, and Apple-inspired aesthetic, ToolNagri performs computations client-side whenever possible for instantaneous execution and high data privacy.
>
> 🌐 **Live Website:** [toolnagri.vercel.app](https://toolnagri.vercel.app)
> 🏢 **Parent Organization:** [Ayodhya Serenity](https://ayodhyaserenity.vercel.app)

---

## 🎨 Design Philosophy
* **Bright & Premium Aesthetic:** Elegant light mode utilizing high-contrast typography, harmonized pastel accents, subtle border shadows, and a clean white background.
* **Micro-Animations:** Fluid state transitions, hover effects, and spring animations powered by **Framer Motion**.
* **Privacy-First:** Operations (e.g. image compression, PDF merging, password generation) are executed completely in the user's browser. Your sensitive files and data never touch a backend server.
* **Fully Responsive:** Mobile-first fluid layouts engineered to adapt perfectly from 320px mobile screens up to 4K ultra-wide monitors.

---

## 🛠️ The Tool Directory (16+ Utilities)

ToolNagri offers a comprehensive suite of utilities organized into four functional groups:

### 💻 Developer Utilities
| Tool | Description | Processing |
| :--- | :--- | :--- |
| **[URL Shortener](https://toolnagri.vercel.app/url-shortener)** | Custom short link generator with target validation. | 🗄️ MongoDB DB Redirection |
| **[JSON Formatter](https://toolnagri.vercel.app/json-formatter)** | Validate, prettify, parse, minify, and copy JSON structures. | ⚡ Client-Side |
| **[Base64 Encoder/Decoder](https://toolnagri.vercel.app/base64)** | Instantly convert text or files to/from Base64 encoding. | ⚡ Client-Side |
| **[UTM Campaign Builder](https://toolnagri.vercel.app/utm-builder)** | Standardize and generate trackable UTM parameters for marketing. | ⚡ Client-Side |

### 🖼️ Image & Document Tools
| Tool | Description | Processing |
| :--- | :--- | :--- |
| **[Image Compressor](https://toolnagri.vercel.app/image-compressor)** | Compress JPG, PNG, and WebP files with adjustable quality factors. | ⚡ Client-Side (Canvas) |
| **[JPG to WebP Converter](https://toolnagri.vercel.app/jpg-to-webp)** | Convert heavy legacy images to modern, high-performance WebP. | ⚡ Client-Side (Canvas) |
| **[PDF Merger](https://toolnagri.vercel.app/pdf-merge)** | Combine multiple PDF files into one clean document with custom order. | ⚡ Client-Side (`pdf-lib`) |
| **[YouTube Thumbnail Downloader](https://toolnagri.vercel.app/youtube-thumbnail)** | Extract high-resolution YouTube video cover images. | ⚡ Client-Side |

### 📐 Calculations & Finance
| Tool | Description | Processing |
| :--- | :--- | :--- |
| **[EMI Loan Calculator](https://toolnagri.vercel.app/emi-calculator)** | Calculate monthly installments, total interest, and amortization graphs. | ⚡ Client-Side |
| **[Age Calculator](https://toolnagri.vercel.app/age-calculator)** | Calculate exact age in years, months, days, minutes, and seconds. | ⚡ Client-Side |
| **[Unit Converter](https://toolnagri.vercel.app/unit-converter)** | Real-time unit conversions for Length, Weight, Temperature, and Area. | ⚡ Client-Side |
| **[Time Zone Converter](https://toolnagri.vercel.app/timezone-converter)** | Convert base date/time across multiple global target timezones. | ⚡ Client-Side |

### ✍️ Generators & Editors
| Tool | Description | Processing |
| :--- | :--- | :--- |
| **[QR Code Generator](https://toolnagri.vercel.app/qr-generator)** | Generate customizable, downloadable vector QR codes. | ⚡ Client-Side (`qrcode`) |
| **[Password Generator](https://toolnagri.vercel.app/password-generator)** | Generate cryptographically secure passwords with custom criteria. | ⚡ Client-Side |
| **[Word Counter](https://toolnagri.vercel.app/word-counter)** | Real-time text analysis displaying word count, reading times, and density. | ⚡ Client-Side |
| **[Character Counter](https://toolnagri.vercel.app/character-counter)** | Detailed character limits, letter frequency, and space analytics. | ⚡ Client-Side |

---

## ⚡ Tech Stack & Architecture

* **Framework:** Next.js 16 (App Router) for hybrid static/dynamic generation.
* **Language:** TypeScript for type safety and clean interfaces.
* **Styling:** Tailwind CSS v4 utilizing CSS variables (`var(--color-accent)`) and utility classes.
* **Animations:** Framer Motion for smooth interface micro-interactions.
* **Database:** MongoDB Atlas (native driver) powering the URL Shortener lookup.
* **Icons:** Lucide React for consistent line-art icons.
* **SEO & Metadata:** Custom dynamic `sitemap.ts` and `robots.ts` to maximize search engine indexing and domain authority.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18.x or later)
* npm / yarn / pnpm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AyodhyaSerenity/ToolNagari.git
   cd ToolNagari
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. Build for production:
   ```bash
   npm run build
   ```

---

## ⚖️ Legal & Branding

* **Ownership:** ToolNagri is owned, operated, and managed by **Ayodhya Serenity**. All rights reserved.
* **Contact Email:** [info.ayodhyaserenity@gmail.com](mailto:info.ayodhyaserenity@gmail.com)
* **Privacy Assurance:** All processing for client-side tools occurs directly inside the client's browser sandbox. No user-uploaded files, passwords, or documents are transmitted to our servers.
