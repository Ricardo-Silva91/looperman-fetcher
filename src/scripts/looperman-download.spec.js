const { test, expect } = require('@playwright/test');
const dotenv = require('dotenv');
const { getItemDataArray, downloadItem } = require('../utils/browser.utils');

dotenv.config();

test('basic test', async ({ page }) => {
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

    await page.waitForTimeout(5000);

    // Check input[name="user_disclaimer"]
    await page.locator('input[name="user_disclaimer"]').check();
    // Click button:has-text("Log In")
    await page.locator('button:has-text("Log In")').click();

    await expect(page).toHaveURL('https://www.looperman.com/');
  }

  /**
     * Go to list.
     */
  await page.goto('https://www.looperman.com/loops?page=1&cid=1&gid=65&when=3&dir=d');

  const items = await page.locator('.jp-audio.jp-state-looped');

  try {
    await items.first().waitFor({ state: 'visible', timeout: 3000 });
  } catch (error) {
    console.log('no items were found');
  }

  const numberOfItems = await items.count();

  console.log({ numberOfItems });

  const itemDataArray = await getItemDataArray(items);

  console.log({ itemDataArray, c: process.env.LOOPERMAN_EMAIL });

  for (let i = 0; i < itemDataArray.length; i += 1) {
    const item = itemDataArray[i];

    await downloadItem({ page, item });
  }
});
