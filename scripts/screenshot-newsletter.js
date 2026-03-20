const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to a desktop size
  await page.setViewportSize({ width: 1280, height: 800 });

  const url = 'http://localhost:3000/wisdom-teeth';
  // eslint-disable-next-line no-console
  console.log(`Navigating to ${url}...`);

  try {
    await page.goto(url, { waitUntil: 'networkidle' });

    // Wait for the newsletter block to be visible
    const selector = '.newsletter-signup > .newsletter-signup-container';
    await page.waitForSelector(selector, { timeout: 10000 });

    // Scroll to the element
    await page.locator(selector).scrollIntoViewIfNeeded();

    // Add a small delay for any lazy loading or transitions
    await page.waitForTimeout(1000);

    // Take screenshot of the viewport
    const screenshotPath = path.join(__dirname, '../screenshots/newsletter-desktop.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    // eslint-disable-next-line no-console
    console.log(`Screenshot saved to ${screenshotPath}`);

    // Mobile View
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector(selector, { timeout: 10000 });
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const mobileScreenshotPath = path.join(__dirname, '../screenshots/newsletter-mobile.png');
    await page.screenshot({ path: mobileScreenshotPath, fullPage: false });
    // eslint-disable-next-line no-console
    console.log(`Mobile screenshot saved to ${mobileScreenshotPath}`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error taking screenshot:', e);
  } finally {
    await browser.close();
  }
})();
