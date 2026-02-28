// =============================================================
// TEST 14: Search Careers - Valid Input
// Menguji fitur pencarian job di halaman Careers dengan keyword valid
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
test('14. Search Job di halaman Careers - Valid Input', async ({ page }) => {
    // Buka halaman Careers
    // timeout 60 detik untuk memastikan html selesai di load, parse, dan network idle tanpa request
    await page.goto(CAREERS_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000); // Tambahan 5 detik untuk memastikan semua script selesai di load

    // Scroll ke bawah melewati hero section agar search field terlihat
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(1000); // Tambahan 1 detik untuk memastikan

    await ambilScreenshot(page, '21_careers_sebelum_search');
    console.log(`📍 Halaman: ${page.url()}`);

    // ── Langkah 1: Cari search field ──────────────────────────
    const searchInput = page.locator('input[placeholder*="Search Job"]').first(); // Selectotr denga placeholder "Search Job"
    const adaSearch = await searchInput.isVisible({ timeout: 5000 }).catch(() => false); // Tunggu sampai search field terlihat
    console.log(`🔍 Search field ditemukan: ${adaSearch}`);

    // Verifikasi: search field harus ada
    expect(adaSearch, '❌ BUG: Search field tidak ditemukan di halaman Careers').toBe(true);

    // ── Langkah 2: Hitung jumlah job cards sebelum search ─────
    const cardsBefore = page.locator('.card');
    const jumlahSebelum = await cardsBefore.count();
    console.log(`💼 Jumlah job cards sebelum search: ${jumlahSebelum}`);

    // ── Langkah 3: Ketik keyword pencarian yang valid ─────────
    // "Data" cocok dengan posisi "Data Engineer" yang ada di halaman Careers
    const keyword = 'Data';
    await searchInput.fill(keyword); // Masukkan keyword "Data" ke dalam search field
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 800)); // Paskan dengan posisi search field dan hasilnya
    await ambilScreenshot(page, '22_careers_search_valid');
    console.log(`🔍 Keyword pencarian: "${keyword}"`);

    // ── Langkah 4: Verifikasi hasil pencarian ─────────────────
    // Cek apakah ada card yang tampil setelah search
    const cardsAfter = page.locator('.card');
    const jumlahSesudah = await cardsAfter.count();
    console.log(`💼 Jumlah job cards setelah search: ${jumlahSesudah}`);

    // Verifikasi: harus ada minimal 1 hasil
    expect(jumlahSesudah, `❌ BUG: Tidak ada hasil untuk pencarian "${keyword}"`).toBeGreaterThan(0);

    // Verifikasi: pesan "No jobs found" TIDAK boleh muncul
    const noResult = page.locator('text=No jobs found matching your search criteria');
    const adaNoResult = await noResult.isVisible({ timeout: 2000 }).catch(() => false);
    expect(adaNoResult, '❌ BUG: Muncul pesan "No jobs found" padahal keyword valid').toBe(false);

    // Verifikasi: halaman tidak error
    await expect(page).not.toHaveURL(/error|500/);
    console.log('✅ TEST 14 PASSED: Search Job dengan keyword valid berhasil');
});


