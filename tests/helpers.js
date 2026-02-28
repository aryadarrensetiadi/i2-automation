// =============================================================
// Helper functions untuk semua test
// URL: https://indonesiaindicator.com/home
// =============================================================

const BASE_URL = 'https://indonesiaindicator.com/home';

// ─── Helper: Buat membuka halaman dan tunggu loading ──────────────────
// Parameter page: objek halaman yang dibuka pada setiap test()
async function bukaHalaman(page) {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
}

// ─── Helper: Buat mengambil screenshot dan simpan ke folder screenshots ─
async function ambilScreenshot(page, nama) {
    await page.screenshot({
        path: `screenshots/${nama}.png`,
        fullPage: false,
    });
    console.log(`📸 Screenshot disimpan: screenshots/${nama}.png`);
}

// Export modul yang ada di file ini
module.exports = { BASE_URL, bukaHalaman, ambilScreenshot };