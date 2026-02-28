// =============================================================
// TEST 3: Filter - Open Positions di halaman Careers
// Menguji fitur filter posisi berdasarkan Department dan Location
// Metode yang digunakan: 
// - Buka halaman Careers
// - Scroll ke bawah melewati hero section agar filter terlihat
// - Ambil ss
// - Cek search field, filter department, dan filter location dan cek apakah terlihat
// - Cek minimal ada 1 filter yang terlihat
// - Cek opsi filter department dan location
// - Pilih index ke 1, ambil ss
// - Cek jumlah card setelah filter, lalu ss
// - Cek apakah ada error 500 
// =============================================================

// Mengimport modul test dan expect dari package playwright/test
const { test, expect } = require('@playwright/test');
// Mengimport fungsi ambilScreenshot dari file helpers.js
const { ambilScreenshot } = require('./helpers');

// URL halaman Careers
const CAREERS_URL = 'https://indonesiaindicator.com/careers';

// Mulai test case
test('3. Filter Open Positions di halaman Careers', async ({ page }) => {
    // Buka halaman Careers
    await page.goto(CAREERS_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);

    // Scroll ke bawah melewati hero section agar filter terlihat
    await page.evaluate(() => window.scrollTo(0, 600)); // Scroll ke bawah melewati hero section agar filter terlihat
    await page.waitForTimeout(1000); // Tunggu 1 detik

    await ambilScreenshot(page, '05_careers_sebelum_filter'); // SS sebelum filter
    console.log(`📍 Halaman: ${page.url()}`);

    // ── Langkah 1: Cek apakah search field ada ────────────────
    const searchInput = page.locator('input[placeholder*="Search Job"]').first();
    const adaSearch = await searchInput.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`🔍 Search field ditemukan: ${adaSearch}`);

    // ── Langkah 2: Cek filter dropdown Department ─────────────
    const filterDepartment = page.locator('select').first();
    const adaFilterDept = await filterDepartment.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`📋 Filter Department ditemukan: ${adaFilterDept}`);

    // ── Langkah 3: Cek filter dropdown Location ───────────────
    // Select locator number ke 1, karena number ke 0 itu department
    const filterLocation = page.locator('select').nth(1);
    const adaFilterLoc = await filterLocation.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`📍 Filter Location ditemukan: ${adaFilterLoc}`);

    // Verifikasi: minimal satu filter harus ada
    expect(adaFilterDept || adaFilterLoc, '❌ BUG: Tidak ada filter dropdown di halaman Careers').toBe(true);

    // ── Langkah 4: Gunakan filter Department ──────────────────
    if (adaFilterDept) {
        // Ambil semua opsi yang tersedia dari tag option
        const optionsDept = await filterDepartment.locator('option').allTextContents();
        console.log(`📋 Opsi Department: ${optionsDept.join(', ')}`);

        // Pilih opsi selain "All" (jika ada)
        // Pilih lebih besar dari 1 karena index 0 itu placeholder "All"
        if (optionsDept.length > 1) {
            const opsiKedua = optionsDept[1]; // Opsi pertama setelah "All"
            await filterDepartment.selectOption({ index: 1 }); // Pilih opsi kedua
            await page.waitForTimeout(2000); // Tunggu 2 detik
            await ambilScreenshot(page, '06_careers_filter_department'); // SS setelah filter
            console.log(`✅ Filter Department dipilih: ${opsiKedua}`);
        }
    }

    // ── Langkah 5: Gunakan filter Location ────────────────────
    if (adaFilterLoc) {
        // Ambil semua opsi yang tersedia
        const optionsLoc = await filterLocation.locator('option').allTextContents();
        console.log(`📍 Opsi Location: ${optionsLoc.join(', ')}`);

        // Pilih opsi selain "All" (jika ada)
        // Pilih lebih besar dari 1 karena index 0 itu placeholder "All"
        if (optionsLoc.length > 1) {
            const opsiKedua = optionsLoc[1]; // Opsi pertama setelah "All"
            await filterLocation.selectOption({ index: 1 }); // Pilih opsi kedua
            await page.waitForTimeout(2000); // Tunggu 2 detik
            await ambilScreenshot(page, '06b_careers_filter_location'); // SS setelah filter
            console.log(`✅ Filter Location dipilih: ${opsiKedua}`);
        }
    }

    // ── Langkah 6: Cek job cards masih tampil ─────────────────
    const jobCards = page.locator('.card'); 
    const jumlahCards = await jobCards.count(); // Cek jumlah job cards setelah filter 
    console.log(`💼 Jumlah job cards setelah filter: ${jumlahCards}`); // Tampilkan di console
    await ambilScreenshot(page, '06c_careers_setelah_filter'); // SS setelah filter

    // Verifikasi: halaman tidak error
    await expect(page).not.toHaveURL(/error|500/); // Cek apakah halaman tidak error
    console.log('✅ TEST 3 PASSED: Filter Open Positions berfungsi');
});
