const { test, expect } = require('@playwright/test');
const dotenv = require('dotenv');
const path = require('path');
const { downloadFromPages, downloadItem } = require('../utils/browser.utils');
const { readFile, writeFile } = require('../utils/fs.utils');

dotenv.config();

test('basic test', async ({ page, context }) => {
  // Go to https://www.looperman.com/loops
  await page.goto('https://www.looperman.com/loops');

  // await page.waitForTimeout(1000);

  const cookiePolicyAgreeButons = await page.locator('text=AGREE');

  await cookiePolicyAgreeButons.first().waitFor({ state: 'visible', timeout: 1000 });

  const numberOfCookiePolicyAgreeButons = await cookiePolicyAgreeButons.count();

  if (numberOfCookiePolicyAgreeButons) {
    // Click text=AGREE
    await page.locator('text=AGREE').click();
  }

  // login
  const shouldLogin = true;

  if (shouldLogin) {
    // Click text=Log In
    await page.locator('text=Log In').click();
    await expect(page).toHaveURL('https://www.looperman.com/account/login');
    // Click input[name="user_email"]
    await page.locator('input[name="user_email"]').click();
    // Fill input[name="user_email"]
    await page.locator('input[name="user_email"]').fill(process.env.LOOPERMAN_EMAIL);
    // Click input[name="upass"]
    await page.locator('input[name="upass"]').click();
    // Fill input[name="upass"]
    await page.locator('input[name="upass"]').fill(process.env.LOOPERMAN_PASSWORD);
    // Click span[role="checkbox"]
    await page.frameLocator('iframe[role="presentation"]').locator('span[role="checkbox"]').click();

    const checkedBox = await page.frameLocator('iframe[role="presentation"]').locator('span[role="checkbox"].recaptcha-checkbox-checked');

    await checkedBox.waitFor({ state: 'visible', timeout: 10000 });

    // Check input[name="user_disclaimer"]
    await page.locator('input[name="user_disclaimer"]').check();
    // Click button:has-text("Log In")
    await page.locator('button:has-text("Log In")').click();

    await expect(page).toHaveURL('https://www.looperman.com/');
  }

  // let hitDailyLimit = false;
  let savedItems = readFile(path.join(process.env.TRIAGE_PATH, '..', 'failedItems.json'));

  if (savedItems !== null && savedItems.length) {
    console.log('has saved items');

    for (let j = 0; j < savedItems.length; j += 1) {
      const item = savedItems[j];
      const { category, genre } = item;

      const result = await downloadItem({
        context, item, category, genre,
      });

      if (result === 'error') {
        console.log('hit limit');
        savedItems = savedItems.slice(j);
        writeFile(path.join(process.env.TRIAGE_PATH, '..', 'failedItems.json'), savedItems);
        return;
      }
    }

    writeFile(path.join(process.env.TRIAGE_PATH, '..', 'failedItems.json'), []);
  } else {
    const res = await downloadFromPages({ page, context });

    console.log({ res: res.hasHitLimit, si: res.storedItems.length });

    if (res.hasHitLimit) {
      writeFile(path.join(process.env.TRIAGE_PATH, '..', 'failedItems.json'), res.storedItems);
    }
  }
});
