# Mahakam Moonlight Studio

> Situs resmi **Mahakam Moonlight Studio** — Tempat Imajinasi Mengalir.
> Statis, dibangun dengan **Tailwind CSS v4**, dwibahasa (ID/EN), dan PWA-ready.

🌐 **Situs studio:** https://mahakam-moonlight-studio.page.gd/

## ✨ Fitur

- **Karya Studio** — portofolio proyek (PHP · MySQL · PWA · i18n, dsb.).
- **Dwibahasa ID / EN** — teks ditandai atribut `data-id` / `data-en`, ditukar tanpa reload.
- **Cerita & FAQ** — profil studio dan pertanyaan yang sering diajukan.
- **PWA** — installable & offline-ready (`site.webmanifest` + `sw.js`).
- **Statis & cepat** — satu file CSS hasil build Tailwind yang sudah di-minify, tanpa framework JS.

## 🛠️ Teknologi

- HTML5 + Tailwind CSS v4 (`@tailwindcss/cli`)
- Vanilla JavaScript
- Service Worker + Web App Manifest (PWA)

## 🚀 Development

Butuh [Node.js](https://nodejs.org/).

```bash
# Install dependensi
npm install

# Mode watch — CSS di-rebuild otomatis saat src/input.css berubah
npm run watch:css

# Build produksi — minify CSS ke assets/css/main.css
npm run build
```

Hasil build sudah di-commit, jadi situs bisa dibuka langsung tanpa build ulang.

## 📁 Struktur

```
MMS/
├── index.html           # Halaman utama (single page)
├── src/input.css        # Sumber Tailwind CSS
├── assets/css/main.css  # Hasil build (committed)
├── site.webmanifest     # Manifest PWA
├── sw.js                # Service worker
└── package.json
```

## ☁️ Deploy

100% statis — hosting di mana saja (GitHub Pages, Netlify, shared hosting).

> Catatan: file verifikasi Google Search Console (`google*.html`) dikecualikan dari repo lewat `.gitignore` — tambahkan langsung di server jika perlu verifikasi ulang.

## 🔗 Tautan

- 🌐 Situs studio: https://mahakam-moonlight-studio.page.gd/
- 💼 LinkedIn: https://www.linkedin.com/in/muhammad-fauzan-raffa-al-habsy-369628411/
- ▶️ YouTube: https://www.youtube.com/@MahakamMoonlightStudio
- 𝕏 X (Twitter): https://x.com/MahakamMoocb

---

Hak cipta © 2026 **Mahakam Moonlight Studio** · mahakammoonlightstudio@gmail.com
