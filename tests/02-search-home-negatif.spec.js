// =============================================================
// TEST 2: Fitur Search di Home - Skenario Negatif (No Result)
// Menguji pencarian dengan kata kunci tidak valid
// Metode yang diguanakan: 
// - Buka halaman
// - Klik tombol search
// - Deteksi apa ada input field yang tampil dengan selector umum
// - Kalo tidak ada input field, maka test FAIL
// - Kalo ada input field, maka test lanjut
// - Lanjut dengan masukan input tidak valid "xyzxyzxyz123456abcabc"
// - Cek apakah muncul pesan "No result" 
// - SS jika ada pesan "No result"
// - Cek apakah ada error 500
// =============================================================

// Mengimport modul test dan expect dari package playwright/test
const { test, expect } = require('@playwright/test');
// Mengimport fungsi bukaHalaman dan ambilScreenshot dari file helpers.js
const { bukaHalaman, ambilScreenshot } = require('./helpers');

// Memulai test case
test('2. Search Home NEGATIF - kata kunci tidak ditemukan', async ({ page }) => {
    await bukaHalaman(page);

    // Klik tombol search di halaman home
    await page.locator('button.btn.me-3.bg-transparent').click();
    await page.waitForTimeout(1500);

    // ── DETEKSI: apakah input field pencarian tampil? ──────────
    const inputSearch = page.locator(
        // Mencocokan input field pencarian dengan berbagai selector yang umum digunakan
        'input[type="search"], input[type="text"][placeholder*="search" i], input[placeholder*="cari" i], input.search-input, [role="search"] input'
    ).first();

    // Mengecek apakah input field pencarian itu terlihat
    const inputMuncul = await inputSearch.isVisible({ timeout: 3000 }).catch(() => false);

    // Mengambil screenshot jika input field tidak tampil
    if (!inputMuncul) {
        await ambilScreenshot(page, '04a_search_home_negatif_tidak_tampil');
    }

    // ── ASSERTION: jika input tidak tampil → test langsung FAIL ─
    expect(inputMuncul, '❌ BUG: Tombol search diklik tapi input field tidak muncul. Fitur search belum diimplementasikan.').toBe(true);

    // Baris di bawah hanya jalan kalau input ditemukan
    console.log('🔍 Input search ditemukan, mengetik kata kunci tidak valid...');
    await inputSearch.fill('xyzxyzxyz123456abcabc'); // Memasukkan input yang tidak valid
    await inputSearch.press('Enter'); // Menekan tombol enter
    await page.waitForTimeout(3000);

    // ── Cek apakah muncul pesan "No Result" ─────────────────────
    const pesanNoResult = page.locator(
        '[class*="no-result"], [class*="empty"], text=/no result/i, text=/tidak ditemukan/i, text=/not found/i'
    ).first();
    // Mengecek jika ada pesan "No Result" atau tidak, catch untuk menangani pesan error
    const adaPesanNoResult = await pesanNoResult.isVisible({ timeout: 3000 }).catch(() => false);

    // Pesan "No Result" seharusnya muncul → kalau tidak ada, test FAIL
    expect(adaPesanNoResult, '❌ BUG: Setelah search kata kunci tidak valid, tidak ada pesan "No Result" yang ditampilkan.').toBe(true);

    await ambilScreenshot(page, '04b_search_home_negatif');
    // Untuk memastikan tidak ada 500 internal server error
    await expect(page).not.toHaveURL(/500|error/);
    console.log('✅ TEST 2 PASSED: Sistem menampilkan No Result dengan benar');
});
