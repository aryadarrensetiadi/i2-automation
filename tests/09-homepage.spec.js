// =============================================================
// TEST 9: Homepage Tampil Normal
// Menguji bahwa homepage tampil dengan konten lengkap
// Metode yang digunakan:
// - Buka halaman
// - Ambil title
// - Cek element penting h1 cek apakah tampil 
// - Scroll page dan ss
// - Pastikan body tidak kosong
// =============================================================

// Mengimport modul test dan expect dari package playwright/test
const { test, expect } = require('@playwright/test');
// Mengimport fungsi bukaHalaman dan ambilScreenshot dari file helpers.js
const { bukaHalaman, ambilScreenshot } = require('./helpers');

test('9. Homepage tampil normal dengan konten lengkap', async ({ page }) => {
    await bukaHalaman(page);

    // Cek judul halaman
    // Ngambil nilai dari tag <title>
    const judul = await page.title();
    console.log(`📋 Judul halaman: ${judul}`);
    expect(judul).toContain('Indonesia Indicator');

    // Cek elemen penting tampil, pake h1 
    const heading = page.locator('h1:has-text("Unlocking Better")');
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Scroll ke bawah untuk pastikan konten lengkap
    await page.keyboard.press('PageDown');
    await page.waitForTimeout(1000);
    await ambilScreenshot(page, '15_homepage_scroll');

    // Cek konten body tidak kosong
    const konten = await page.locator('body').innerText();
    expect(konten.length).toBeGreaterThan(100);

    console.log('✅ TEST 9 PASSED: Homepage tampil normal dengan konten lengkap');
});
