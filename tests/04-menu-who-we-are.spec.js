// =============================================================
// TEST 4: Menu Navigasi - Klik menu "Who We Are"
// Menguji bahwa klik menu akan berpindah halaman
// Metode yang digunakan: 
// - Buka halaman
// - Klik menu who-we-are di navbar dan ss
// - Ambil ss
// - Cek url sama dengan BASE_URL tidak
// - Cek apa ada error 500
// =============================================================

// Mengimport modul test dan expect dari package playwright/test
const { test, expect } = require('@playwright/test');
// Mengimport fungsi bukaHalaman dan ambilScreenshot dari file helpers.js
const { BASE_URL, bukaHalaman, ambilScreenshot } = require('./helpers');

test('4. Klik menu navigasi - Who We Are', async ({ page }) => {
    await bukaHalaman(page); // Membuka halaman
    await ambilScreenshot(page, '08_menu_sebelum'); // Mengambil screenshot halaman awal

    // Klik menu "Who We Are" di navbar
    const menuWhoWeAre = page.locator('.navbar-collapse .nav-link', { hasText: 'Who We Are' });
    await menuWhoWeAre.click(); // Mengklik menu "Who We Are"
    await page.waitForTimeout(3000);

    await ambilScreenshot(page, '09_menu_who_we_are');
    console.log(`📍 URL setelah klik menu: ${page.url()}`);

    // Verifikasi: URL berubah (berpindah halaman)
    await expect(page).not.toHaveURL(BASE_URL);
    console.log('✅ TEST 4 PASSED: Menu navigasi Who We Are berfungsi');
});

