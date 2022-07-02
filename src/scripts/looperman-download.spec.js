const { test, expect } = require('@playwright/test');
const dotenv = require('dotenv');
const { getItemDataArray, downloadItem } = require('../utils/browser.utils');
const { getTextOfElement } = require('../utils/playwright-helpers/utils/browser.utils');

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

    const checkedBox = await page.frameLocator('iframe[role="presentation"]').locator('span[role="checkbox"].recaptcha-checkbox-checked');

    await checkedBox.waitFor({ state: 'visible', timeout: 10000 });

    // Check input[name="user_disclaimer"]
    await page.locator('input[name="user_disclaimer"]').check();
    // Click button:has-text("Log In")
    await page.locator('button:has-text("Log In")').click();

    await expect(page).toHaveURL('https://www.looperman.com/');
  }

  const pages = process.env.PAGE_URLS.split(',');

  console.log({ pages });

  for (let i = 0; i < pages.length; i += 1) {
    const currentUrl = pages[i];

    /**
       * Go to list.
       */
    await page.goto(currentUrl);

    const genreFull = await getTextOfElement({ page, query: '.section-title' });
    const genre = genreFull.replace('Free ', '').replace(' Drum Music Loops & Samples', '');

    const categorySelect = await page.locator('select[name="cid"]');

    categorySelect.waitFor({ state: 'visible' });

    const categorySelectValue = await page.$eval('select[name="cid"]', (sel) => sel.value);
    const category = await getTextOfElement({ page: categorySelect, query: `option[value="${categorySelectValue}"]` });

    console.log({
      genre, category,
    });

    const items = await page.locator('.jp-audio.jp-state-looped');

    try {
      await items.first().waitFor({ state: 'visible', timeout: 3000 });
    } catch (error) {
      console.log('no items were found');
    }

    const numberOfItems = await items.count();

    console.log({ numberOfItems });

    const itemDataArray = await getItemDataArray(items);

    console.log({ itemDataArray });

    for (let j = 0; j < itemDataArray.length; j += 1) {
      const item = itemDataArray[j];

      await downloadItem({ page, item, category, genre });
    }
  }
});
