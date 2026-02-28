// playwright.config.js
// Konfigurasi Playwright untuk pengujian website Indonesia Indicator

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    // Folder tempat file test
    testDir: './tests',

    // Timeout per test: 60 detik
    timeout: 60000,

    // Retry 0 kali (tidak ada retry), tambahin jika mau deteksi flaky
    retries: 0,

    // Reporter: HTML report + console output
    reporter: [
        ['list'],
        // Buat report html interaktif
        // Reportnya diambil dari folder test-report
        // open: 'never' artinya tidak otomatis membuka report setelah test selesai
        // run npx playwright show-report test-report buat buka reportnya
        // host: '0.0.0.0' agar bisa diakses via IP, bukan hanya localhost
        ['html', { open: 'never', outputFolder: 'test-report', host: '0.0.0.0' }]
    ],

    use: {
        // Base URL website yang diuji
        // Tidak dipakai karena kita menggunakan helper bukaHalaman() di helpers.js
        baseURL: 'https://indonesiaindicator.com',

        // Screenshot otomatis saat test gagal
        // Screenshot disimpan di test-results/
        screenshot: 'on',

        // Ukuran viewport, seperti tampilan saat di akses user
        viewport: { width: 1280, height: 720 },

        // Timeout navigasi
        navigationTimeout: 30000,

        // Timeout aksi (klik, ketik, dll)
        actionTimeout: 15000,
    },
});
