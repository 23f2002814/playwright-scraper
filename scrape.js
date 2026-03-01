const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let total = BigInt(0);

  for (let seed = 4; seed <= 13; seed++) {
    const url = `https://tools.iitm.ac.in/playwrightjs/table?seed=${seed}`;
    console.log(`Scraping: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForSelector('table', { timeout: 20000 });

    const nums = await page.$$eval('td, th', els =>
      els.map(e => e.innerText.trim()).filter(t => /^-?\d+$/.test(t))
    );
    console.log(`  seed ${seed}: ${nums.length} numbers`);
    for (const n of nums) total += BigInt(n);
  }

  await browser.close();
  console.log(`Total Sum: ${total}`);
})().catch(e => { console.error(e); process.exit(1); });
