// =============================================================
// TEST 11: Menu Navigasi - Careers
// Menguji navigasi ke halaman Careers
// Metode yang digunakan:
// - Buka halaman
// - Klik menu Careers dengan selector .navbar-collapse .nav-link 
// - Ambil ss
// - Verifikasi URL berubah dengan toContain
// - Cek tidak ada error 500
// =============================================================

// Mengimport modul test dan expect dari package playwright/test
const { test, expect } = require('@playwright/test');
// Mengimport fungsi bukaHalaman dan ambilScreenshot dari file helpers.js
const { bukaHalaman, ambilScreenshot } = require('./helpers');

test('11. Klik menu navigasi - Careers', async ({ page }) => {
    await bukaHalaman(page); // Membuka halaman

    // Klik menu "Careers" di navbar
    const menu = page.locator('.navbar-collapse .nav-link', { hasText: 'Careers' });
    await menu.click();
    await page.waitForTimeout(3000);

    await ambilScreenshot(page, '17_menu_careers');
    console.log(`📍 URL setelah klik: ${page.url()}`);

    // Verifikasi: URL berubah ke halaman careers
    expect(page.url()).toContain('careers');
    await expect(page).not.toHaveURL(/error|500/);// Pastikan tidak ada error 500 internal server error
    console.log('✅ TEST 11 PASSED: Menu Careers berfungsi');
});
