// =============================================================
// TEST 8: Online News - Klik artikel berita
// Menguji fitur berita dan link "Read More"
// Metode yang digunakan:
// - Buka halaman
// - 
// =============================================================

// Mengimport modul test dan expect dari package playwright/test
const { test, expect } = require('@playwright/test');
// Mengimport fungsi bukaHalaman dan ambilScreenshot dari file helpers.js
const { bukaHalaman, ambilScreenshot } = require('./helpers');

test('8. Buka berita Online News dan klik Read More', async ({ page }) => {
    await bukaHalaman(page);

    // Cari section News Update dan klik "See All"
    const seeAll = page.locator('a[href="news"]').first();
    await seeAll.click();
    await page.waitForTimeout(3000);

    // Mengambil screenshot halaman daftar berita
    await ambilScreenshot(page, '13_news_halaman_daftar');
    console.log(`📍 Halaman news: ${page.url()}`);

    // Kembali ke home untuk cek "Read More" di homepage
    await bukaHalaman(page);

    // ── Cari link "Read More" di section News Update ─────────────
    // Struktur HTML website: <a href="..." target="_blank"><span>Read More</span></a>
    // Link "Read More" membuka berita EKSTERNAL di tab baru (target="_blank")
    const readMoreLink = page.locator('a[target="_blank"]:has(span:has-text("Read More"))').first();
    const adaReadMore = await readMoreLink.isVisible({ timeout: 5000 }).catch(() => false);

    if (adaReadMore) {
        // Ambil href dari link Read More
        const href = await readMoreLink.getAttribute('href');
        console.log(`🔗 Link Read More ditemukan: ${href}`);

        // Verifikasi: href harus berisi URL valid (bukan "#" atau kosong)
        // Jika href nilainya tidak truthy, maka akan error
        expect(href, '❌ BUG: Link Read More tidak memiliki URL yang valid').toBeTruthy();
        // Jika href nilainya "#", maka akan error
        expect(href, '❌ BUG: Link Read More mengarah ke "#" (placeholder)').not.toBe('#');

        // Klik link Read More — karena target="_blank", akan buka tab baru
        // Playwright: tangkap event popup (tab baru)
        // Promise.all untuk menjalankan operasi async secara pararel
        const [newPage] = await Promise.all([
            page.context().waitForEvent('page', { timeout: 10000 }),
            readMoreLink.click(), // Mengeklik link Read More
        ]);

        // Tunggu tab baru selesai loading
        await newPage.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => { });
        await newPage.waitForTimeout(2000);

        // Mengambil URL tab baru
        const urlArtikel = newPage.url();
        console.log(`📍 URL artikel (tab baru): ${urlArtikel}`);
        await ambilScreenshot(newPage, '14_news_artikel_detail');

        // Verifikasi: URL tab baru bukan homepage (artinya berhasil redirect)
        expect(urlArtikel).not.toContain('indonesiaindicator.com/home');
        console.log('✅ Link Read More berhasil membuka artikel di tab baru');

        // Tutup tab baru
        await newPage.close();
    } else {
        console.log('ℹ️  Tombol Read More tidak ditemukan di homepage');
        await ambilScreenshot(page, '14_news_readmore_tidak_ada');
    }

    // Verifikasi: halaman utama tidak error
    await expect(page).not.toHaveURL(/error|500/);
    console.log('✅ TEST 8 PASSED: Pengujian berita Online News selesai');
});
