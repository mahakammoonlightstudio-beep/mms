# Mahakam Moonlight Studio

Situs resmi Mahakam Moonlight Studio - tempat imajinasi mengalir. Sepenuhnya statis, dibangun dengan Tailwind CSS v4, dwibahasa Indonesia/Inggris, dan siap dipasang sebagai PWA.

**Live: <https://mahakam-moonlight-studio.page.gd/>**

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8) ![PWA](https://img.shields.io/badge/PWA-ready-5a0fc8)

## Fitur

- **Karya Studio** - portofolio proyek (PHP, MySQL, PWA, i18n, dan lainnya).
- **Dwibahasa Indonesia / Inggris** - teks ditandai atribut `data-id` / `data-en`, ditukar tanpa reload.
- **Cerita dan FAQ** - profil studio dan pertanyaan yang sering diajukan.
- **PWA** - dapat dipasang dan berfungsi offline melalui manifest dan service worker.
- **Statis dan cepat** - satu berkas CSS hasil build Tailwind yang sudah di-minify, tanpa framework JavaScript.

## Persyaratan

- Node.js 18 atau lebih baru (hanya untuk development)

## Development

```bash
# Pasang dependensi
npm install

# Mode watch - CSS dibangun ulang otomatis saat src/input.css berubah
npm run watch:css

# Build produksi - minify CSS ke assets/css/main.css
npm run build
```

Hasil build sudah di-commit, sehingga situs dapat dibuka langsung tanpa membangun ulang.

## Struktur Proyek

```
MMS/
├── index.html           # Halaman utama (single page)
├── src/input.css        # Sumber Tailwind CSS
├── assets/css/main.css  # Hasil build (di-commit)
├── site.webmanifest     # Manifest PWA
├── sw.js                # Service worker
└── package.json
```

## Deploy

Situs ini sepenuhnya statis dan dapat di-hosting di mana saja (GitHub Pages, Netlify, shared hosting).

Catatan: berkas verifikasi Google Search Console (`google*.html`) dikecualikan dari repositori lewat `.gitignore`; tambahkan langsung di server bila perlu verifikasi ulang.

## Tautan

- Situs studio: <https://mahakam-moonlight-studio.page.gd/>
- LinkedIn: <https://www.linkedin.com/in/muhammad-fauzan-raffa-al-habsy-369628411/>
- YouTube: <https://www.youtube.com/@MahakamMoonlightStudio>
- X (Twitter): <https://x.com/MahakamMoocb>

## Lisensi

Hak cipta 2026 Mahakam Moonlight Studio.
