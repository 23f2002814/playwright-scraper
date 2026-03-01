const { chromium } = require('playwright');

(async () => {
  const seeds = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  let grandTotal = 0;
  
  const browser = await chromium.launch();
  
  for (const seed of seeds) {
    const page = await browser.newPage();
    const url = `https://www.r2.environment.gov.za/gauteng/seed=${seed}`;
    
    console.log(`Scraping ${url}...`);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      
      // Find all tables and sum all numbers
      const numbers = await page.$$eval('table', (tables) => {
        let sum = 0;
        tables.forEach(table => {
          const cells = table.querySelectorAll('td, th');
          cells.forEach(cell => {
            const text = cell.textContent.trim();
            const num = parseFloat(text);
            if (!isNaN(num)) {
              sum += num;
            }
          });
        });
        return sum;
      });
      
      console.log(`Seed ${seed} sum: ${numbers}`);
      grandTotal += numbers;
      
    } catch (error) {
      console.error(`Error scraping seed ${seed}:`, error.message);
    }
    
    await page.close();
  }
  
  await browser.close();
  console.log('='.repeat(40));
  console.log(`GRAND TOTAL: ${grandTotal}`);
  console.log('='.repeat(40));
})();
