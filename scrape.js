const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const seeds = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  let grandTotal = 0;

  for (const seed of seeds) {
    const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;
    console.log(`[INFO] Processing URL: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle' });

    // Wait for dynamically rendered table elements
    await page.waitForSelector('table', { timeout: 10000 }).catch(() => {});

    // Scrape and extract all numbers from all tables on the page
    const pageSum = await page.evaluate(() => {
      const tables = document.querySelectorAll('table');
      let sum = 0;
      tables.forEach(table => {
        const text = table.innerText;
        const matches = text.match(/-?\d+(?:\.\d+)?/g);
        if (matches) {
          matches.forEach(numStr => {
            sum += parseFloat(numStr);
          });
        }
      });
      return sum;
    });

    console.log(`[SEED ${seed}] Subtotal: ${pageSum}`);
    grandTotal += pageSum;
  }

  await browser.close();

  console.log('========================================');
  console.log(`TOTAL SUM OF ALL NUMBERS: ${grandTotal}`);
  console.log('========================================');
})();
