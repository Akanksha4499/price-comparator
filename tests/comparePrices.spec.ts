import { test, expect } from '@playwright/test';

test('Compare price of iPhone 15 Plus on Flipkart and Amazon', async ({ browser }) => {
  const flipkartContext = await browser.newContext();
  const amazonContext = await browser.newContext();

  const onlineshoppingsite = await flipkartContext.newPage();
  const onlineshopping = await amazonContext.newPage();

  const product = 'iphone 15 plus';
  let flipkartPrice = 0;
  let amazonPrice = 0;

  await Promise.all([
    (async () => {
      // Flipkart
      await onlineshoppingsite.goto('https://www.flipkart.com');
      expect(onlineshoppingsite.url()).toContain('flipkart');
      expect(await onlineshoppingsite.title()).toContain('Online Shopping Site');

      try {
        await onlineshoppingsite.locator('button:has-text("✕")').click({ timeout: 3000 });
      } catch {}

      await onlineshoppingsite.locator('input[title="Search for products, brands and more"]').fill(product);
      await onlineshoppingsite.keyboard.press('Enter');

      await onlineshoppingsite.waitForSelector('div._30jeq3', { timeout: 15000 });

      const titles = await onlineshoppingsite.locator('div._4rR01T, a.IRpwTa').allInnerTexts();
      const prices = await onlineshoppingsite.locator('div._30jeq3').allInnerTexts();

      if (titles.length && prices.length) {
        flipkartPrice = parseInt(prices[0].replace(/[^0-9]/g, ''));
        console.log(`Flipkart Title: ${titles[0]}`);
        console.log(`Flipkart Price: ₹${flipkartPrice}`);
      } else {
        console.log('Could not extract data from Flipkart.');
      }
    })(),

    (async () => {
      // Amazon
      await onlineshopping.goto('https://www.amazon.in');
      expect(onlineshopping.url()).toContain('amazon');
      expect(await onlineshopping.title()).toContain('Amazon');

      await onlineshopping.locator('input[name="field-keywords"]').fill(product);
      await onlineshopping.keyboard.press('Enter');

      await onlineshopping.waitForSelector('[data-component-type="s-search-result"] span.a-price-whole', {
        timeout: 15000,
      });

      const title = await onlineshopping.locator('span.a-size-medium').first().innerText();
      const priceWhole = await onlineshopping.locator('span.a-price-whole').first().innerText();
      const priceFraction = await onlineshopping.locator('span.a-price-fraction').first().innerText();
      const fullPrice = `${priceWhole}${priceFraction}`;
      amazonPrice = parseInt(fullPrice.replace(/[^0-9]/g, ''));

      console.log(`Amazon Title: ${title}`);
      console.log(`Amazon Price: ₹${amazonPrice}`);
    })()
  ]);

  // Final comparison
  if (flipkartPrice && amazonPrice) {
    if (flipkartPrice < amazonPrice) {
      console.log('Flipkart has the lower price.');
    } else if (amazonPrice < flipkartPrice) {
      console.log('Amazon has the lower price.');
    } else {
      console.log('Both prices are the same.');
    }
  } else {
    console.log('Could not fetch both prices properly.');
  }
});
