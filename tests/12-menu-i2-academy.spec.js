// =============================================================
// TEST 12: Menu Navigasi - i2 Academy
// Menguji navigasi ke halaman i2 Academy
// Metode yang digunakan:
// - Buka halaman
// - Klik menu i2 Academy
// - Ambil ss
// - Verifikasi URL berubah dengan toContain
// - Cek tidak ada error 500
// =============================================================

// Mengimport modul test dan expect dari package playwright/test
const { test, expect } = require('@playwright/test');
// Mengimport fungsi bukaHalaman dan ambilScreenshot dari file helpers.js
const { bukaHalaman, ambilScreenshot } = require('./helpers');

test('12. Klik menu navigasi - i2 Academy', async ({ page }) => {
    await bukaHalaman(page); // Membuka halaman

    // Klik menu "i2 Academy" di navbar
    const menu = page.locator('.navbar-collapse .nav-link', { hasText: 'i2 Academy' });
    await menu.click(); // Mengeklik menu i2 Academy
    await page.waitForTimeout(3000);

    await ambilScreenshot(page, '18_menu_i2_academy');
    console.log(`📍 URL setelah klik: ${page.url()}`); // Menampilkan URL di console

    // Verifikasi: URL berubah ke halaman i2-academy
    expect(page.url()).toContain('i2-academy');
    await expect(page).not.toHaveURL(/error|500/); // Pastikan tidak ada error 600 internal server error
    console.log('✅ TEST 12 PASSED: Menu i2 Academy berfungsi');
});
