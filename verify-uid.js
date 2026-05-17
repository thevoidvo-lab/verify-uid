const { chromium } = require('playwright');

// ========================
// KONFIGURASI - EDIT INI
// ========================
const UID = '15730422727'; // Ganti dengan UID FF lo
const INTERVAL_JAM = 5;
// ========================

const INTERVAL_MS = INTERVAL_JAM * 60 * 60 * 1000;

function log(msg) {
    const now = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    console.log(`[${now}] ${msg}`);
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function verifyUID() {
    log(`Memulai verify UID: ${UID}`);

    const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined;

    const browser = await chromium.launch({
        headless: true,
        executablePath,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--single-process'
        ]
    });

    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
        viewport: { width: 390, height: 844 },
    });

    // Block iklan
    await context.route('**/*', route => {
        const blocked = ['quge5.com', 'monetag', 'pushground', 'adnxs', 'doubleclick', 'googlesyndication'];
        if (blocked.some(b => route.request().url().includes(b))) route.abort();
        else route.continue();
    });

    const page = await context.newPage();
    page.on('dialog', async d => { await d.dismiss(); });

    try {
        log('Membuka halaman...');
        await page.goto('https://ffkipas.my.id/verifyuid', { waitUntil: 'domcontentloaded', timeout: 30000 });

        log('Mengisi UID...');
        await page.waitForSelector('input', { timeout: 10000 });
        await page.fill('input', UID);
        await sleep(1000);

        // Klik tombol VERIFY UID
        log('Klik VERIFY UID...');
        await page.click('button:has-text("VERIFY UID")');
        await sleep(2000);

        // Step 1-4: tombol "Continue Process"
        for (let step = 1; step <= 4; step++) {
            log(`Step ${step}/5 - Continue Process...`);
            try {
                await page.waitForSelector('button:has-text("Continue Process")', { timeout: 15000 });
                await sleep(1500);
                await page.click('button:has-text("Continue Process")');
                await sleep(2000);
                log(`✅ Step ${step} berhasil`);
            } catch (e) {
                log(`⚠️ Step ${step} gagal: ${e.message}`);
            }
        }

        // Step 5: tombol "Finalize Verification" (beda teks!)
        log('Step 5/5 - Finalize Verification...');
        try {
            await page.waitForSelector('button:has-text("Finalize Verification")', { timeout: 15000 });
            await sleep(1500);
            await page.click('button:has-text("Finalize Verification")');
            await sleep(3000);
            log('✅ Step 5 berhasil');
        } catch (e) {
            log(`⚠️ Step 5 gagal: ${e.message}`);
        }

        // Cek hasil akhir
        const success = await page.$('text=Verification Complete');
        if (success) {
            log('🎉 VERIFY BERHASIL! UID sudah masuk whitelist.');
        } else {
            const pageText = await page.textContent('body');
            log(`⚠️ Selesai tapi tidak ada konfirmasi sukses.`);
            log(`Isi halaman: ${pageText.substring(0, 200)}`);
        }

    } catch (err) {
        log(`❌ ERROR: ${err.message}`);
    } finally {
        await browser.close();
    }
}

async function main() {
    log('=== Auto Verify UID FF KIPAS ===');
    log(`UID: ${UID} | Interval: ${INTERVAL_JAM} jam`);

    await verifyUID();

    setInterval(async () => {
        log(`--- Interval ${INTERVAL_JAM} jam ---`);
        await verifyUID();
    }, INTERVAL_MS);
}

main();
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
        viewport: { width: 390, height: 844 },
    });

    // Block iklan
    await context.route('**/*', route => {
        const blocked = ['quge5.com', 'monetag', 'pushground', 'adnxs', 'doubleclick', 'googlesyndication'];
        if (blocked.some(b => route.request().url().includes(b))) route.abort();
        else route.continue();
    });

    const page = await context.newPage();
    page.on('dialog', async d => { await d.dismiss(); });

    try {
        log('Membuka halaman...');
        await page.goto('https://ffkipas.my.id/verifyuid', { waitUntil: 'domcontentloaded', timeout: 30000 });

        log('Mengisi UID...');
        await page.waitForSelector('input', { timeout: 10000 });
        await page.fill('input', UID);

        log('Klik VERIFY UID...');
        await page.click('button');
        await sleep(2000);

        for (let step = 1; step <= 5; step++) {
            log(`Step ${step}/5...`);
            try {
                await page.waitForSelector('button:has-text("Continue")', { timeout: 10000 });
                await sleep(1500);
                await page.click('button:has-text("Continue")');
            } catch {
                const done = await page.$('text=Verification Complete');
                if (done) break;
            }
        }

        await sleep(2000);
        const success = await page.$('text=Verification Complete');
        log(success ? '✅ VERIFY BERHASIL!' : '⚠️ Selesai tanpa konfirmasi sukses.');

    } catch (err) {
        log(`❌ ERROR: ${err.message}`);
    } finally {
        await browser.close();
    }
}

async function main() {
    log('=== Auto Verify UID FF KIPAS ===');
    log(`UID: ${UID} | Interval: ${INTERVAL_JAM} jam`);

    await verifyUID();

    setInterval(async () => {
        log(`--- Interval ${INTERVAL_JAM} jam ---`);
        await verifyUID();
    }, INTERVAL_MS);
}

main();
