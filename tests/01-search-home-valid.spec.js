// =============================================================
// TEST 1: Fitur Search di Home - Kata Kunci Valid
// Menguji pencarian dengan kata kunci "politik"
// Metode yang digunakan: 
// - Membuka halaman
// - Mengambil screenshot halaman awal
// - Klik tombol search
// - Mendeteksi apakah input pencarian tampil tidak dengan selector umum
// - Kalo tidak ada input pencarian, maka test FAIL
// - Kalo ada input pencarian, maka test lanjut
// - Lanjut dengan masukan input valid "Politik" dan ss
// - Kemudian cek apakah ada error 500 kalo masukan input valid
// =============================================================

// Mengimport modul test dan expect dari package playwright/test
const { test, expect } = require('@playwright/test');
// Mengimport fungsi bukaHalaman dan ambilScreenshot dari file helpers.js
const { bukaHalaman, ambilScreenshot } = require('./helpers');

// Memulai test case
test('1. Search dengan kata kunci valid', async ({ page }) => {
    await bukaHalaman(page); // Membuka halaman
    await ambilScreenshot(page, '01_halaman_awal'); // Mengambil screenshot halaman awal

    // Buat klik tombol search (ikon kaca pembesar di navbar)
    await page.locator('button.btn.me-3.bg-transparent').click();
    await page.waitForTimeout(1500);
    await ambilScreenshot(page, '02_search_home_diklik');

    // ── DETEKSI: apakah input field pencarian tampil? ──────────
    const inputSearch = page.locator(
        // Mencocokan input field pencarian dengan berbagai selector yang umum digunakan
        'input[type="search"], input[type="text"][placeholder*="search" i], input[placeholder*="cari" i], input.search-input, [role="search"] input'
    ).first();

    // Mengecek apakah input field pencarian itu terlihat
    const inputMuncul = await inputSearch.isVisible({ timeout: 3000 }).catch(() => false);

    // Mengambil screenshot jika input field tidak tampil
    if (!inputMuncul) {
        await ambilScreenshot(page, '03a_search_home_valid_tidak_tampil');
    }

    // ── ASSERTION: jika input tidak tampil → test langsung FAIL ─
    // Jika inputMuncul false, testnya FAIL
    expect(inputMuncul, '❌ BUG: Tombol search diklik tapi input field tidak muncul. Fitur search belum diimplementasikan.').toBe(true);

    // Baris di bawah ini hanya jalan kalau assertion di atas lolos
    console.log('🔍 Input search ditemukan, melanjutkan test...');
    await inputSearch.fill('politik'); // Mengisi input field dengan kata kunci "politik"
    await inputSearch.press('Enter'); // Mmenekan tombol Enter
    await page.waitForTimeout(3000);

    await ambilScreenshot(page, '03b_search_home_hasil_valid');  // Mengambil screenshot hasil pencarian
    await expect(page).not.toHaveURL(/error|500/);
    console.log('✅ TEST 1 PASSED: Search dengan kata kunci valid berhasil');
});




