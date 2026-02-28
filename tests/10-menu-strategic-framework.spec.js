// =============================================================
// TEST 10: Menu Navigasi - Strategic Framework
// Menguji navigasi ke halaman Strategic Framework
// Metode yang digunakan:
// - Buka halaman
// - Klik menu Strategic Framework
// - Ambil ss
// - Verifikasi URL berubah dengan toContain
// - Cek tidak ada error 500
// =============================================================

// Mengimport modul test dan expect dari package playwright/test
const { test, expect } = require('@playwright/test');
// Mengimport fungsi bukaHalaman dan ambilScreenshot dari file helpers.js
const { bukaHalaman, ambilScreenshot } = require('./helpers');

test('10. Klik menu navigasi - Strategic Framework', async ({ page }) => {
    await bukaHalaman(page); // Membuka halaman

    // Klik menu "Strategic Framework" di navbar
    const menu = page.locator('.navbar-collapse .nav-link', { hasText: 'Strategic Framework' });
    await menu.click();
    await page.waitForTimeout(3000);

    await ambilScreenshot(page, '16_menu_strategic_framework');
    console.log(`📍 URL setelah klik: ${page.url()}`);

    // Verifikasi: URL berubah ke halaman strategic-framework
    expect(page.url()).toContain('strategic-framework');
    await expect(page).not.toHaveURL(/error|500/);
    console.log('✅ TEST 10 PASSED: Menu Strategic Framework berfungsi');
});
