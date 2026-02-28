// =============================================================
// TEST 17: Button CTA (Call-to-Action)
// Menguji fungsi tombol-tombol CTA di berbagai halaman
// Tombol dengan atribut navigate seharusnya berpindah halaman
// Tombol tanpa navigate/href seharusnya tidak berfungsi (BUG)
// Metode yang digunakan:
// - Buka halaman
// - 
// =============================================================

// Mengimport modul test dan expect dari package playwright/test
const { test, expect } = require('@playwright/test');
// Mengimport fungsi ambilScreenshot dari file helpers.js
const { ambilScreenshot } = require('./helpers');

// Base URL
const BASE = 'https://indonesiaindicator.com';

// ── Test 17a: Button "Learn More" (link) di Homepage ──────────
test('17a. Button Learn More (link) di Homepage → navigate who-we-are', async ({ page }) => {
    await page.goto(`${BASE}/home`, { waitUntil: 'domcontentloaded', timeout: 60000 }); // Ke page home
    await page.waitForTimeout(5000);

    // Cari <a navigate="who-we-are"> dengan teks "Learn More"
    const btn = page.locator('a[navigate="who-we-are"]:has-text("Learn More")').first(); // Mengambil button Learn More yang bertipe <a> navigate ke who-we-are
    await btn.scrollIntoViewIfNeeded(); // Scroll ke button agar terlihat
    await page.waitForTimeout(500);
    await ambilScreenshot(page, '27a_home_btn_learn_more_link_sebelum');

    const adaBtn = await btn.isVisible().catch(() => false);
    console.log(`🔘 Button <a> Learn More ditemukan: ${adaBtn}`); // Jika false maka akan fail
    expect(adaBtn, '❌ Button <a> Learn More tidak ditemukan di homepage').toBe(true);

    // Cek atribut navigate
    const navigateAttr = await btn.getAttribute('navigate');
    console.log(`🔗 Atribut navigate: ${navigateAttr}`);

    // Klik dan cek navigasi
    const urlSebelum = page.url();
    await btn.click(); // Klik button Learn More
    await page.waitForTimeout(3000);
    const urlSesudah = page.url();
    console.log(`📍 URL sebelum: ${urlSebelum}`);
    console.log(`📍 URL sesudah: ${urlSesudah}`);
    await ambilScreenshot(page, '27a_home_btn_learn_more_link_sesudah');

    // Verifikasi: harus navigasi ke /who-we-are
    // FAIL jika urlSesudah tidak mengandung who-we-are
    expect(urlSesudah, '❌ BUG: Button Learn More <a> tidak navigasi ke /who-we-are').toContain('who-we-are');
    console.log('✅ TEST 17a PASSED: Button Learn More (link) navigasi ke /who-we-are');
});

// ── Test 17b: Button "Learn More" (button) di Homepage ────────
// Button yang ada dibagian bawah hero section
test('17b. Button Learn More (button) di Homepage → navigate who-we-are', async ({ page }) => {
    await page.goto(`${BASE}/home`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);

    // Cari <button navigate="who-we-are"> dengan teks "Learn More"
    const btn = page.locator('button[navigate="who-we-are"]').first();
    await btn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await ambilScreenshot(page, '27b_home_btn_learn_more_button_sebelum');

    const adaBtn = await btn.isVisible().catch(() => false);
    console.log(`🔘 Button <button> Learn More ditemukan: ${adaBtn}`);
    expect(adaBtn, '❌ Button <button> Learn More tidak ditemukan di homepage').toBe(true);

    // Cek atribut navigate
    const navigateAttr = await btn.getAttribute('navigate');
    console.log(`🔗 Atribut navigate: ${navigateAttr}`);

    // Klik dan cek navigasi
    const urlSebelum = page.url();
    await btn.click();
    await page.waitForTimeout(3000);
    const urlSesudah = page.url();
    console.log(`📍 URL sebelum: ${urlSebelum}`);
    console.log(`📍 URL sesudah: ${urlSesudah}`);
    await ambilScreenshot(page, '27b_home_btn_learn_more_button_sesudah');

    // Verifikasi: harus navigasi ke /who-we-are
    expect(urlSesudah, '❌ BUG: Button Learn More <button> tidak navigasi ke /who-we-are').toContain('who-we-are');
    console.log('✅ TEST 17b PASSED: Button Learn More (button) navigasi ke /who-we-are');
});

// ── Test 17c: Button "Get Started" di Strategic Framework ─────
test('17c. Button Get Started di Strategic Framework → cek fungsi', async ({ page }) => {
    // Ke page strategic framework
    await page.goto(`${BASE}/strategic-framework`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);

    // Cari button "Get Started"
    const btn = page.locator('button:has-text("Get Started")').first();
    await btn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await ambilScreenshot(page, '27c_sf_btn_get_started_sebelum'); // Screenshot button Get Startedsebelum button diklik

    const adaBtn = await btn.isVisible().catch(() => false); // Cek apkah button tampil
    console.log(`🔘 Button Get Started ditemukan: ${adaBtn}`);
    // Assert apakah button tampil, jika tidak akan FAIL
    expect(adaBtn, '❌ Button Get Started tidak ditemukan di Strategic Framework').toBe(true);

    // Cek atribut navigate dan href
    const navigateAttr = await btn.getAttribute('navigate');
    const hrefAttr = await btn.getAttribute('href');
    const onclickAttr = await btn.getAttribute('onclick');
    console.log(`🔗 navigate: ${navigateAttr}`);
    console.log(`🔗 href: ${hrefAttr}`);
    console.log(`🔗 onclick: ${onclickAttr}`);

    // Klik — force:true karena ada CSS overlay (back-center) yang intercept pointer
    // Klik paksa tanpa pengecekan 
    const urlSebelum = page.url();
    await btn.click({ force: true });
    await page.waitForTimeout(3000);
    const urlSesudah = page.url();
    // Bersihkan URL dari #
    const urlBersihSebelum = urlSebelum.replace(/#$/, '');
    const urlBersihSesudah = urlSesudah.replace(/#$/, '');
    console.log(`📍 URL sebelum: ${urlSebelum}`);
    console.log(`📍 URL sesudah: ${urlSesudah}`);
    await ambilScreenshot(page, '27c_sf_btn_get_started_sesudah');

    // Verifikasi: button tanpa navigate => tidak berpindah = BUG
    const adaNavigasi = !navigateAttr && !hrefAttr && urlBersihSebelum === urlBersihSesudah;
    if (adaNavigasi) {
        console.log('⚠️  FINDING: Button Get Started tidak memiliki atribut navigate/href');
        console.log('⚠️  FINDING: URL tidak berubah setelah klik');
    }
    expect(adaNavigasi, '❌ BUG: Button Get Started tidak memiliki fungsi navigasi — tidak ada navigate/href dan URL tidak berubah').toBe(false);
    console.log('✅ TEST 17c PASSED: Button Get Started berfungsi');
});

// ── Test 17d: Button "Learn More" di Careers ──────────────────
test('17d. Button Learn More di Careers → cek fungsi onclick', async ({ page }) => {
    await page.goto(`${BASE}/careers`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);

    // Cari button "Learn More" dengan id="learnMoreButton"
    const btn = page.locator('#learnMoreButton').first(); // Dengan selector id
    await btn.scrollIntoViewIfNeeded().catch(() => { });
    await page.waitForTimeout(500);
    await ambilScreenshot(page, '27d_careers_btn_learn_more_sebelum');

    // Cek apakah button tampil
    const adaBtn = await btn.isVisible().catch(() => false);
    console.log(`🔘 Button Learn More (Careers) ditemukan: ${adaBtn}`);
    expect(adaBtn, '❌ Button Learn More tidak ditemukan di Careers').toBe(true);

    // Cek atribut
    const navigateAttr = await btn.getAttribute('navigate');
    const hrefAttr = await btn.getAttribute('href');
    const onclickAttr = await btn.getAttribute('onclick');
    console.log(`🔗 navigate: ${navigateAttr}`);
    console.log(`🔗 href: ${hrefAttr}`);
    console.log(`🔗 onclick: ${onclickAttr}`);

    // Intercept dialog (alert) kalo ada
    let alertMessage = null;
    page.on('dialog', async (dialog) => {
        alertMessage = dialog.message();
        console.log(`⚠️  Alert muncul: "${alertMessage}"`);
        // Klik cancel tutup dialog
        await dialog.dismiss();
    });

    const urlSebelum = page.url();
    // Klik button
    await btn.click();
    await page.waitForTimeout(3000);
    const urlSesudah = page.url();
    // Bersihkan URL dari #
    const urlBersihSebelum = urlSebelum.replace(/#$/, '');
    const urlBersihSesudah = urlSesudah.replace(/#$/, '');
    console.log(`📍 URL sebelum: ${urlSebelum}`);
    console.log(`📍 URL sesudah: ${urlSesudah}`);
    await ambilScreenshot(page, '27d_careers_btn_learn_more_sesudah');

    // Verifikasi: cek apa yang sebenarnya terjadi
    const tidakNavigasi = urlBersihSebelum === urlBersihSesudah;
    const alertMuncul = alertMessage !== null;

    if (tidakNavigasi) {
        console.log('⚠️  FINDING: URL tidak berubah setelah klik — tidak ada navigasi');
        if (alertMuncul) {
            console.log(`⚠️  FINDING: Alert muncul dengan pesan: "${alertMessage}"`);
            console.log('⚠️  FINDING: Button hanya menampilkan alert, bukan navigasi');
        } else if (onclickAttr) { // Kalo ada onclick tapi alert tidak muncul
            console.log(`⚠️  FINDING: Button memiliki onclick="${onclickAttr}" tapi alert TIDAK muncul`);
            console.log('⚠️  FINDING: Fungsi onclick tidak berjalan — button sepenuhnya tidak berfungsi');
        } else { // Kalo tidak ada onclick
            console.log('⚠️  FINDING: Button tidak memiliki navigate/href/onclick');
        }
    }
    expect(tidakNavigasi && !navigateAttr, '❌ BUG: Button Learn More di Careers tidak berfungsi — tidak ada navigasi dan tidak ada aksi yang terjadi').toBe(false);
    console.log('✅ TEST 17d PASSED: Button Learn More di Careers berfungsi dengan navigasi');
});

// ── Test 17e: Button "Join Us" di i2 Academy ──────────────────
test('17e. Button Join Us di i2 Academy → cek fungsi', async ({ page }) => {
    await page.goto(`${BASE}/i2-academy`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);

    // Cari button "Join Us"
    const btn = page.locator('button:has-text("Join Us")').first();
    await btn.scrollIntoViewIfNeeded().catch(() => { }); // Scroll ke button
    await page.waitForTimeout(500);
    await ambilScreenshot(page, '27e_academy_btn_join_us_sebelum');

    const adaBtn = await btn.isVisible().catch(() => false);
    console.log(`🔘 Button Join Us ditemukan: ${adaBtn}`);
    expect(adaBtn, '❌ Button Join Us tidak ditemukan di i2 Academy').toBe(true); // Assertion button tampil

    // Cek atribut
    const navigateAttr = await btn.getAttribute('navigate');
    const hrefAttr = await btn.getAttribute('href');
    console.log(`🔗 navigate: ${navigateAttr}`);
    console.log(`🔗 href: ${hrefAttr}`);

    // Klik dan cek
    const urlSebelum = page.url();
    await btn.click();
    await page.waitForTimeout(3000);
    const urlSesudah = page.url();
    // Bersihkan URL dari #
    const urlBersihSebelum = urlSebelum.replace(/#$/, '');
    const urlBersihSesudah = urlSesudah.replace(/#$/, '');
    console.log(`📍 URL sebelum: ${urlSebelum}`);
    console.log(`📍 URL sesudah: ${urlSesudah}`);
    await ambilScreenshot(page, '27e_academy_btn_join_us_sesudah');

    // Verifikasi: tanpa navigate => tidak berfungsi = BUG
    const adaNavigasi = !navigateAttr && !hrefAttr && urlBersihSebelum === urlBersihSesudah;
    if (adaNavigasi) {
        console.log('⚠️  FINDING: Button Join Us tidak memiliki atribut navigate/href');
        console.log('⚠️  FINDING: URL tidak berubah setelah klik');
    }
    expect(adaNavigasi, '❌ BUG: Button Join Us tidak memiliki fungsi navigasi — tidak ada navigate/href dan URL tidak berubah').toBe(false);
    console.log('✅ TEST 17e PASSED: Button Join Us berfungsi');
});

// ── Test 17f: Link "See All" di i2 Academy ────────────────────
test('17f. Link See All di i2 Academy → cek fungsi', async ({ page }) => {
    await page.goto(`${BASE}/i2-academy`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);

    // Cari <a> "See All"
    const btn = page.locator('a:has-text("See All")').first(); //locator a dengan text see all
    await btn.scrollIntoViewIfNeeded().catch(() => { }); // Scroll ke button otomatis jika tidak terlihat di viewport
    await page.waitForTimeout(500);
    await ambilScreenshot(page, '27f_academy_link_see_all_sebelum');

    const adaBtn = await btn.isVisible().catch(() => false);
    console.log(`🔘 Link See All ditemukan: ${adaBtn}`);
    expect(adaBtn, '❌ Link See All tidak ditemukan di i2 Academy').toBe(true); // Assertion button tampil, jika tidak ada akan FAIL

    // Cek atribut navigate dan href
    const navigateAttr = await btn.getAttribute('navigate');
    const hrefAttr = await btn.getAttribute('href');
    console.log(`🔗 navigate: ${navigateAttr}`);
    console.log(`🔗 href: ${hrefAttr}`);

    // Klik dan cek
    const urlSebelum = page.url();
    await btn.click(); // Klik link
    await page.waitForTimeout(3000); // Tunggu 3 detik
    const urlSesudah = page.url(); // Ambil URL setelah klik
    // Bersihkan URL dari #
    const urlBersihSebelum = urlSebelum.replace(/#$/, ''); 
    const urlBersihSesudah = urlSesudah.replace(/#$/, ''); 
    console.log(`📍 URL sebelum: ${urlSebelum}`);
    console.log(`📍 URL sesudah: ${urlSesudah}`);
    await ambilScreenshot(page, '27f_academy_link_see_all_sesudah');

    // Verifikasi: tanpa navigate/href => tidak berfungsi = BUG
    const tidakBerfungsi = !navigateAttr && (!hrefAttr || hrefAttr === '#') && urlBersihSebelum === urlBersihSesudah;
    if (tidakBerfungsi) {
        console.log('⚠️  FINDING: Link See All tidak memiliki atribut navigate/href');
        console.log('⚠️  FINDING: URL tidak berubah setelah klik');
    }
    expect(tidakBerfungsi, '❌ BUG: Link See All tidak memiliki fungsi navigasi — tidak ada navigate/href dan URL tidak berubah').toBe(false);
    console.log('✅ TEST 17f PASSED: Link See All berfungsi');
});
