// =============================================================
// TEST 7: Social Media - Cek link sosial media di footer
// Menguji bahwa link social media tersedia
// Metode yang digunakan:
// - Buka halaman
// - Input keyboard End untuk ke footer
// - Ambil ss
// - Loop pengecekan link dari sosialLinks dan update ditemukan ++
// - Verifikasi minimal 1 link ditemukan
// =============================================================

// Mengimport modul test dan expect dari package playwright/test
const { test, expect } = require('@playwright/test');
// Mengimport fungsi bukaHalaman dan ambilScreenshot dari file helpers.js
const { bukaHalaman, ambilScreenshot } = require('./helpers');

test('7. Cek link Social Media', async ({ page }) => {
    await bukaHalaman(page);

    // Scroll ke bawah untuk melihat footer
    // Untuk langsung ke footer tanpa scroll
    await page.keyboard.press('End');
    await page.waitForTimeout(2000);
    await ambilScreenshot(page, '12_social_media_footer');

    // Cek link social media yang tersedia
    const socialLinks = {
        'Twitter/X': 'a[href*="x.com"], a[href*="twitter.com"]',
        'Instagram': 'a[href*="instagram.com"]',
        'LinkedIn': 'a[href*="linkedin.com"]',
    };

    let ditemukan = 0;

    // Loop melalui socialLinks dan cek apakah link ditemukan
    for (const [nama, selector] of Object.entries(socialLinks)) {
        // Memilih locator berdasarkan selector yang ada pertama kali
        const link = page.locator(selector).first();
        // Jika href tidak ada maka akan mengembalikan null
        const href = await link.getAttribute('href').catch(() => null);

        // Jika href ada maka akan menambahkan counter ditemukan
        if (href) {
            console.log(`  ✔ ${nama}: ${href}`);
            ditemukan++;
        } else {
            console.log(`  ✖ ${nama}: tidak ditemukan`);
        }
    }

    // Verifikasi: minimal 1 link social media harus ditemukan
    expect(ditemukan).toBeGreaterThan(0);
    console.log(`✅ TEST 7 PASSED: ${ditemukan} link social media ditemukan`);
});
