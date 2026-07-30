# ToolNagri

A modern, privacy-first web utility platform offering a comprehensive suite of offline-first, client-side tools and services.

## Resume Points

* **Developed** a high-performance, privacy-first web utility platform containing 40+ specialized developer, calculator, image, and text tools utilizing Next.js 16, TypeScript, and Tailwind CSS v4.
* **Architected** a serverless, client-side processing model executing heavy document and image processing—including multi-file PDF merging, page splitting, and Canvas-based image compression—directly within the browser, eliminating server-side bandwidth overhead and ensuring absolute user data privacy.
* **Engineered** a dynamic URL shortening service with custom slug parameters, link expiration logic, and automated redirection handlers via dynamic Next.js API route segments.
* **Integrated** MongoDB Atlas utilizing the native Node.js MongoDB driver to record shortened link records, automate expired slug cleanups, and track real-time analytics including cumulative click metrics.
* **Implemented** external API integrations, including Cloudflare's secure DNS-over-HTTPS (DoH) API for real-time client-side DNS record resolution (A, AAAA, MX, TXT) and ipapi/ipify REST APIs for automated client IP and geolocation lookups.
* **Optimized** search engine discoverability and indexing efficiency by implementing dynamic, automated sitemap and crawler instructions targeting all tool paths.
* **Designed** responsive, high-fidelity UI components utilizing Framer Motion for micro-interactions and smooth spring animations, optimized to render consistently from mobile views up to 4K resolutions.

## Tech Stack

Frontend: React, Next.js, HTML5, CSS3, TypeScript, Tailwind CSS v4  
Backend: Next.js (Server Actions & Route Handlers), Node.js  
Database: MongoDB, MongoDB Atlas  
Authentication: None (Public platform)  
Libraries: pdf-lib, qrcode, framer-motion, canvas-confetti, lucide-react  
APIs & Services: Cloudflare DNS-over-HTTPS (DoH) API, ipapi.co Geolocation API, ipify.org IP API  
Deployment: Vercel  
Tools: Git, npm, TypeScript Compiler (tsc), ESLint  

## Keywords

Next.js, React, TypeScript, Tailwind CSS, MongoDB, MongoDB Atlas, Node.js, Server Actions, Route Handlers, pdf-lib, qrcode, Cloudflare DoH API, ipapi, ipify, Canvas API, Client-side Processing, URL Shortening, Analytics, PDF Merging, Image Compression, Framer Motion, Vercel, SEO, Sitemap, Robots.txt
