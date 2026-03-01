const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  let total = BigInt(0);

  const urls = [4,5,6,7,8,9,10,11,12,13].map(s =>
    `https://sanand0.github.io/tdsdata/js_table/?seed=${s}`
  );

  for (const url of urls) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('table');

    const nums = await page.$$eval('td, th', els =>
      els.map(e => e.innerText.trim()).filter(t => /^-?\d+$/.test(t))
    );
    console.log(`seed ${url.split('=')[1]}: ${nums.length} numbers`);
    for (const n of nums) total += BigInt(n);
    await page.close();
  }

  await browser.close();
  console.log(`Total Sum: ${total}`);
})().catch(e => { console.error(e); process.exit(1); });
