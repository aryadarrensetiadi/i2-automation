// =============================================================
// TEST 13: Language Toggle - English
// Menguji tombol toggle bahasa English di navbar
// Pendekatan: cek apakah toggle bahasa benar-benar ada / diimplementasi
// Metode yang digunakan:
// - Buka halaman
// - 
// =============================================================

// Mengimport modul test dan expect dari package playwright/test
const { test, expect } = require('@playwright/test');
// Mengimport fungsi bukaHalaman dan ambilScreenshot dari file helpers.js
const { bukaHalaman, ambilScreenshot } = require('./helpers');

// Mulai test case
test('13. Klik toggle bahasa English', async ({ page }) => {
    await bukaHalaman(page);
    await ambilScreenshot(page, '19_sebelum_toggle_bahasa');

    // Simpan URL dan konten sebelum klik, untuk dideteksi apakah berubah urlnya
    const urlSebelum = page.url();

    // ── Langkah 1: Cari elemen toggle bahasa ──────────────────
    // Selector: hasText 'English' di dalam navbar-collapse
    const toggleBahasa = page.locator('.navbar-collapse a', { hasText: 'English' });
    const adaToggle = await toggleBahasa.isVisible({ timeout: 5000 }).catch(() => false);

    // Deteksi: apakah tombol English ada?
    expect(adaToggle, '❌ BUG: Toggle bahasa English tidak ditemukan di navbar').toBe(true);

    // ── Langkah 2: Cek href dari link English ─────────────────
    // Link yang valid harus punya href selain "#" (placeholder)
    const href = await toggleBahasa.getAttribute('href');
    console.log(`🔗 Href toggle bahasa: ${href}`);

    // ── Langkah 3: Cek apakah ada dropdown/menu bahasa ────────
    // Cari elemen dropdown bahasa (select, ul, atau menu popup)
    const dropdownBahasa = page.locator('select[name*="lang"], select[id*="lang"], .language-dropdown, .lang-switcher, .language-selector, [class*="language"]');
    const adaDropdown = await dropdownBahasa.first().isVisible({ timeout: 2000 }).catch(() => false);
    console.log(`📋 Dropdown bahasa ditemukan: ${adaDropdown}`);

    // ── Langkah 4: Klik toggle dan cek perubahan ──────────────
    await toggleBahasa.click();
    await page.waitForTimeout(3000);

    await ambilScreenshot(page, '20_setelah_toggle_bahasa');
    const urlSesudah = page.url();
    console.log(`📍 URL sebelum: ${urlSebelum}`);
    console.log(`📍 URL sesudah: ${urlSesudah}`);

    // Cek apakah ada prubahan setelah klik:
    // - URL berubah (misal ?lang=id) — bukan cuma tambah "#" di akhir
    // - Muncul dropdown bahasa
    // - Konten halaman berubah bahasa
    // Hapus # di akhir url sebelum dibandingkan, karena # hanya placeholder
    const urlBersihSebelum = urlSebelum.replace(/#$/, '');
    const urlBersihSesudah = urlSesudah.replace(/#$/, '');
    const urlBerubah = urlBersihSebelum !== urlBersihSesudah;
    console.log(`🔍 URL berubah (setelah abaikan #): ${urlBerubah}`);
    // Cek apakah menu dropdown tampil setelah diklik
    const munculDropdown = await dropdownBahasa.first().isVisible({ timeout: 2000 }).catch(() => false);

    // ── Langkah 5: Evaluasi hasil ─────────────────────────────
    // href="#" + URL hanya berubah dari /home → /home# = TIDAK VALID
    if (href === '#' && !urlBerubah && !munculDropdown && !adaDropdown) {
        // Toggle bahasa tidak berfungsi — laporkan sebagai bug
        console.log('⚠️  FINDING: Toggle bahasa English memiliki href="#" (placeholder)');
        console.log('⚠️  FINDING: Tidak ada dropdown bahasa yang muncul');
        console.log('⚠️  FINDING: URL tidak berubah setelah klik');
        expect(false, '❌ BUG: Toggle bahasa belum diimplementasi — href="#", tidak ada dropdown, URL tidak berubah setelah klik').toBe(true);
    } else {
        console.log('✅ Toggle bahasa memiliki respons setelah diklik');
    }

    // Verifikasi: halaman tidak error setelah klik toggle bahasa
    await expect(page).not.toHaveURL(/error|500/);
    console.log('✅ TEST 13 PASSED: Pengujian toggle bahasa selesai');
});
