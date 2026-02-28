// =============================================================
// TEST 5: Menu Navigasi - Product
// Menguji navigasi ke halaman Product
// Metode yang digunakan: 
// - Buka halaman
// - Klik menu product di navbar dan ss
// - Cek url mengandung product
// - Cek apakah ada error 500
// =============================================================

// Mengimport modul test dan expect dari package playwright/test
const { test, expect } = require('@playwright/test');
// Mengimport fungsi bukaHalaman dan ambilScreenshot dari file helpers.js
const { bukaHalaman, ambilScreenshot } = require('./helpers');

test('5. Klik menu navigasi - Product', async ({ page }) => {
    await bukaHalaman(page);

    // Klik menu "Product" di navbar
    // Locator: hasText Product di navbar-collapse
    const menuProduct = page.locator('.navbar-collapse .nav-link', { hasText: 'Product' });
    await menuProduct.click();
    await page.waitForTimeout(3000);

    await ambilScreenshot(page, '10_menu_product');
    console.log(`📍 URL setelah klik Product: ${page.url()}`);

    // Verifikasi: URL berubah ke halaman Product
    expect(page.url()).toContain('product');
    await expect(page).not.toHaveURL(/error|500/);
    console.log('✅ TEST 5 PASSED: Menu navigasi Product berfungsi');
});
