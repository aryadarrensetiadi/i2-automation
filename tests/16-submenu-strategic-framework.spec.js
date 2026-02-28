// =============================================================
// TEST 16: Sub Menu - Strategic Framework (Learn More)
// Menguji tombol "Learn More" di halaman Strategic Framework
// yang menggunakan atribut navigate untuk pindah ke sub-halaman
// Metode yang digunakan:
// - Setiap sub-menu dipisah jadi test case sendiri (16a-16j)
// - Buka halaman strategic-framework
// - Cari button dengan atribut navigate yang sesuai
// - Klik button, cek URL berubah ke sub-halaman
// - Cek apakah halaman sub-menu mengembalikan error 500
// - Ambil screenshot per sub-menu
// =============================================================

// Mengimport modul test dan expect dari package playwright/test
const { test, expect } = require('@playwright/test');
// Mengimport fungsi ambilScreenshot dari file helpers.js
const { ambilScreenshot } = require('./helpers');

// URL halaman Strategic Framework
// Langsung menggunakan URL karna lebih cepat, stabil dan terisolasi. Selain itu Menu Strategic Framework sudah di testing secara terpisah
const SF_URL = 'https://indonesiaindicator.com/strategic-framework';

// Daftar semua sub-menu "Learn More" yang ada di halaman Strategic Framework
const subMenus = [
    { kode: 'a', nama: 'Geostrategic Intelligence', navigate: 'geostrategic-inteligence' },
    { kode: 'b', nama: 'Political Intelligence', navigate: 'political-inteligence' },
    { kode: 'c', nama: 'Security Intelligence', navigate: 'security-inteligence' },
    { kode: 'd', nama: 'Economic Intelligence', navigate: 'economic-inteligence' },
    { kode: 'e', nama: 'Financial Intelligence', navigate: 'financial-inteligence' },
    { kode: 'f', nama: 'Market Intelligence', navigate: 'market-inteligence' },
    { kode: 'g', nama: 'Demographic Intelligence', navigate: 'demographic-inteligence' },
    { kode: 'h', nama: 'Territorial Intelligence', navigate: 'territorial-inteligence' },
    { kode: 'i', nama: 'Industrial Intelligence', navigate: 'industrial-inteligence' },
    { kode: 'j', nama: 'Media Intelligence', navigate: 'media-inteligence' },
];

// Generate test case terpisah untuk setiap sub-menu (looping)
// Sehingga di Playwright HTML Report muncul 10 baris terpisah
// dan langsung terlihat mana yang PASS / FAIL / ERROR 500
for (const sub of subMenus) {
    test(`16${sub.kode}. Sub Menu - ${sub.nama}`, async ({ page }) => {
        // Buka halaman Strategic Framework
        await page.goto(SF_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(5000);

        // Cari tombol "Learn More" dengan atribut navigate yang sesuai
        const btnLearnMore = page.locator(`button[navigate="${sub.navigate}"]`);
        const adaBtn = await btnLearnMore.isVisible({ timeout: 5000 }).catch(() => false);

        // Verifikasi: tombol harus ditemukan
        expect(adaBtn, `❌ Tombol Learn More untuk "${sub.nama}" tidak ditemukan`).toBe(true);

        // Scroll ke tombol agar terlihat
        await btnLearnMore.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await ambilScreenshot(page, `25_submenu_${sub.navigate.replace(/-/g, '_')}_sebelum`);

        // Intercept response untuk cek status code 500
        let statusCode = null;
        page.on('response', (response) => {
            if (response.url().includes(sub.navigate) && response.status() >= 400) {
                statusCode = response.status();
            }
        });

        // Klik tombol Learn More
        await btnLearnMore.click();
        await page.waitForTimeout(3000);

        // Cek URL setelah klik
        const urlSetelah = page.url();
        console.log(`📍 URL setelah klik: ${urlSetelah}`);

        // Cek apakah halaman menampilkan error 500
        const pageContent = await page.textContent('body');
        const ada500 = statusCode === 500 ||
            pageContent.includes('500') && pageContent.includes('Internal Server Error') ||
            pageContent.includes('500 Internal Server Error') ||
            pageContent.includes('Application error');

        // Ambil screenshot hasil
        await ambilScreenshot(page, `26_submenu_${sub.navigate.replace(/-/g, '_')}`);

        // Hapus listener response
        // Agar tetap stabil dan tidak fflaky, serta terjadi memory leak
        page.removeAllListeners('response');

        // Verifikasi: tidak boleh error 500
        expect(ada500, `❌ BUG: ${sub.nama} mengembalikan 500 Internal Server Error (HTTP ${statusCode || 500})`).toBe(false);

        // Verifikasi: URL harus berubah ke sub-halaman yang sesuai
        expect(urlSetelah, `❌ BUG: URL tidak berubah ke /${sub.navigate}`).toContain(sub.navigate);

        console.log(`✅ ${sub.nama} — navigasi berhasil, no 500 error`);
    });
}


