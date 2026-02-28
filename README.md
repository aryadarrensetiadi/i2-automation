# 🧪 Automasi Pengujian Website - Indonesia Indicator

Proyek automasi pengujian website [indonesiaindicator.com](https://indonesiaindicator.com) menggunakan **Playwright** dan **JavaScript**.

## 📋 Daftar Test Case

| No | File | Deskripsi |
|----|------|-----------|
| 1 | `01-search-home-valid.spec.js` | Search valid dengan keyword "politik" |
| 2 | `02-search-home-negatif.spec.js` | Search negatif → No Result |
| 3 | `03-filter.spec.js` | Filter Department & Location di Careers |
| 4 | `04-menu-who-we-are.spec.js` | Menu navigasi Who We Are |
| 5 | `05-menu-product.spec.js` | Menu navigasi Product |
| 6 | `06-menu-news.spec.js` | Menu navigasi News |
| 7 | `07-social-media.spec.js` | Cek link social media di footer |
| 8 | `08-online-news.spec.js` | Klik Read More berita (new tab) |
| 9 | `09-homepage.spec.js` | Homepage tampil normal |
| 10 | `10-menu-strategic-framework.spec.js` | Menu navigasi Strategic Framework |
| 11 | `11-menu-careers.spec.js` | Menu navigasi Careers |
| 12 | `12-menu-i2-academy.spec.js` | Menu navigasi i2 Academy |
| 13 | `13-language-toggle.spec.js` | Toggle bahasa English |
| 14 | `14-search-careers-valid.spec.js` | Search job valid di Careers |
| 15 | `15-search-careers-negatif.spec.js` | Search job negatif di Careers |
| 16 | `16-submenu-strategic-framework.spec.js` | 10 sub-menu Learn More + cek error 500 |
| 17 | `17-button-cta.spec.js` | Button CTA di berbagai halaman |

## 🐛 Bug yang Ditemukan

| Bug | Halaman | Detail |
|-----|---------|--------|
| Toggle bahasa tidak berfungsi | `/home` | Klik English hanya menambah `#` di URL |
| Button Get Started tidak berfungsi | `/strategic-framework` | Tidak ada navigate/href |
| Button Learn More tidak berfungsi | `/careers` | onclick alert tidak jalan |
| Button Join Us tidak berfungsi | `/i2-academy` | Tidak ada navigate/href |
| Link See All tidak berfungsi | `/i2-academy` | Tidak ada navigate/href |
| Media Intelligence error 500 | `/media-inteligence` | 500 Internal Server Error |

## 🚀 Cara Menjalankan

```bash
# Install
npm install
npx playwright install chromium

# Jalankan semua test
npm test

# Jalankan test tertentu
npx playwright test tests/01-search-home-valid.spec.js

# Lihat report (akses via IP)
npx playwright show-report test-report --host 0.0.0.0

# Atau lihat report via Domain i2-test.aripurin.my.id
```

## 📁 Struktur Proyek

```
i2-automation/
├── tests/
│   ├── helpers.js                # Helper: bukaHalaman(), ambilScreenshot()
│   ├── 01-search-home-valid.spec.js
│   ├── ...
│   └── 17-button-cta.spec.js
├── screenshots/                  # Screenshot hasil test
├── test-report/                  # Laporan HTML Playwright
├── test-results/                 # Hasil test (auto-generated)
├── playwright.config.js          # Konfigurasi Playwright
├── package.json
└── README.md
```

## 🛠️ Teknologi

- **Playwright** - Browser automation framework
- **JavaScript** - Bahasa pemrograman
- **Node.js** - Runtime environment
