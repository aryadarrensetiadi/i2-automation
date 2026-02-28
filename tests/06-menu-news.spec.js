// =============================================================
// TEST 6: Menu Navigasi - News
// Menguji navigasi ke halaman News
// =============================================================

// Mengimport modul test dan expect dari package playwright/test
const { test, expect } = require('@playwright/test');
// Mengimport fungsi bukaHalaman dan ambilScreenshot dari file helpers.js
const { bukaHalaman, ambilScreenshot } = require('./helpers');

test('6. Klik menu navigasi - News', async ({ page }) => {
    await bukaHalaman(page);

    // Klik menu "News" di navbar
    const menuNews = page.locator('.navbar-collapse .nav-link', { hasText: 'News' });
    await menuNews.click();
    await page.waitForTimeout(3000);

    await ambilScreenshot(page, '11_menu_news');
    console.log(`📍 URL setelah klik News: ${page.url()}`);

    // Verifikasi: URL berubah ke halaman News
    expect(page.url()).toContain('news');
    await expect(page).not.toHaveURL(/error|500/);
    console.log('✅ TEST 6 PASSED: Menu navigasi News berfungsi');
});
