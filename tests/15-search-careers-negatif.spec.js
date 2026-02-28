// =============================================================
// TEST 15: Search Careers - Negative Test (Invalid Input)
// Menguji fitur pencarian job dengan keyword yang tidak valid
// Hasil yang diharapkan: "No jobs found matching your search criteria."
// Metode yang digunakan:
// - Buka halaman
// - 
// =============================================================

// Mengimport modul test dan expect dari package playwright/test
const { test, expect } = require('@playwright/test');
// Mengimport fungsi ambilScreenshot dari file helpers.js
const { ambilScreenshot } = require('./helpers');

// URL halaman Careers
const CAREERS_URL = 'https://indonesiaindicator.com/careers';

// Mulai test case
test('15. Search Job di halaman Careers - Negatif Test (keyword tidak valid)', async ({ page }) => {
    // Buka halaman Careers
    await page.goto(CAREERS_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);

    // Scroll ke bawah melewati hero section agar search field terlihat
    // Hero section: bagian paling nonjol, biasanya dibagian atas
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(1000);

    await ambilScreenshot(page, '23_careers_sebelum_search_negatif');
    console.log(`📍 Halaman: ${page.url()}`);

    // ── Langkah 1: Cari search field ──────────────────────────
    const searchInput = page.locator('input[placeholder*="Search Job"]').first();
    const adaSearch = await searchInput.isVisible({ timeout: 5000 }).catch(() => false); // Untuk deteksi apakah search field tampil
    console.log(`🔍 Search field ditemukan: ${adaSearch}`);

    // Verifikasi: search field harus ada
    expect(adaSearch, '❌ BUG: Search field tidak ditemukan di halaman Careers').toBe(true);

    // ── Langkah 2: Ketik keyword pencarian yang TIDAK valid ───
    // Keyword acak yang pasti tidak cocok dengan posisi apapun
    const keywordInvalid = 'xyzabc123invalidjob000mautakjil';
    await searchInput.fill(keywordInvalid); // Masukkan keywordnya
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 800)); // Paskan posisi agar terlihat saat di ss
    await ambilScreenshot(page, '24_careers_search_negatif');
    console.log(`🔍 Keyword pencarian (invalid): "${keywordInvalid}"`);

    // ── Langkah 3: Verifikasi pesan "No jobs found" ───────────
    // Harus muncul pesan: "No jobs found matching your search criteria."
    const noResult = page.locator('text=No jobs found matching your search criteria');
    const adaNoResult = await noResult.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`📭 Pesan "No jobs found" ditemukan: ${adaNoResult}`);

    // Verifikasi: pesan harus muncul
    expect(adaNoResult, '❌ BUG: Pesan "No jobs found matching your search criteria" tidak muncul saat keyword tidak valid').toBe(true);

    // ── Langkah 4: Verifikasi tidak ada job cards tampil ──────
    const cards = page.locator('.card'); // Selector untuk job cards
    const jumlahCards = await cards.count(); // Hitung jumlah card
    console.log(`💼 Jumlah job cards: ${jumlahCards}`);
    // Harus 0 card karena pencarian tidak valid
    expect(jumlahCards, '❌ BUG: Masih ada job cards yang tampil padahal keyword tidak valid').toBe(0);

    // Verifikasi: halaman tidak error
    await expect(page).not.toHaveURL(/error|500/);
    console.log('✅ TEST 15 PASSED: Negatif test search Careers berhasil - pesan "No jobs found" muncul');
});
