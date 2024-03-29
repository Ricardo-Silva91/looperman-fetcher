const path = require('path');
const { moveFile } = require('./fs.utils');
const { getTextOfElement } = require('./playwright-helpers/utils/browser.utils');

const getItemDataArray = async (items, { category, genre }) => {
  const itemDataArray = [];
  const numberOfItems = await items.count();

  for (let i = 0; i < numberOfItems; i += 1) {
    const item = await items.nth(i);
    const title = await getTextOfElement({ page: item, query: '.player-title' });
    const author = await getTextOfElement({ page: item, query: '.icon-small.icon-user' });
    const href = await item.locator('.player-title').first().getAttribute('href');
    const id = href.replace('https://www.looperman.com/loops/detail/', '').split('/')[0];

    const filename = `${`${id}-${author}-${title}`.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 100)}.wav`;

    itemDataArray.push({
      id,
      title,
      author,
      href,
      filename,
      category,
      genre,
    });
  }

  return itemDataArray;
};

const downloadItem = async ({
  context, item, category, genre,
}) => {
  const { href, title, filename } = item;

  // console.log({ href });

  const page = await context.newPage();

  await page.goto(href);

  const downloadButtons = await page.locator('.player-wrapper .player-big-btn.btn-download');
  const downloadButton = await downloadButtons.first();

  try {
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 5000 }),
      downloadButton.click(),
    ]);

    console.log('will wait for', title);

    const downloadPath = await download.path();

    // console.log({ downloadPath });

    if (downloadPath) {
      moveFile(
        downloadPath,
        path.join(process.env.TRIAGE_PATH, category, genre, filename),
        [
          path.join(process.env.TRIAGE_PATH, category),
          path.join(process.env.TRIAGE_PATH, category, genre),
        ],
      );
    }

    await page.waitForTimeout(3000);

    await page.close();
    return 'success';
  } catch (error) {
    console.log('error downloading');
    await page.close();
    return 'error';
  }
};

const getItemsInPage = async (page) => {
  const genreSelect = await page.locator('select[name="gid"]');

  await genreSelect.waitFor({ state: 'visible' });

  const genreSelectValue = await page.$eval('select[name="gid"]', (sel) => sel.value);
  const genre = await getTextOfElement({ page: genreSelect, query: `option[value="${genreSelectValue}"]` });

  const categorySelect = await page.locator('select[name="cid"]');

  await categorySelect.waitFor({ state: 'visible' });

  const categorySelectValue = await page.$eval('select[name="cid"]', (sel) => sel.value);
  const category = await getTextOfElement({ page: categorySelect, query: `option[value="${categorySelectValue}"]` });

  console.log({
    genre, category,
  });

  const items = await page.locator('.jp-audio.jp-state-looped');

  return ({
    items,
    genre,
    category,
  });
};

const getRandomItems = async (page) => {
  let noItemsFound = true;
  let itemDataArray = [];

  while (noItemsFound) {
    const genreSelect = await page.locator('select[name="gid"]');
    const genreSelectOptions = await genreSelect.locator('option');
    const categorySelect = await page.locator('select[name="cid"]');
    const categorySelectOptions = await categorySelect.locator('option');
    const categorySelectOptionsCount = await categorySelectOptions.count();

    const categoryToPickIndex = Math.floor(Math.random() * categorySelectOptionsCount) || 1;
    const categoryToPick = await genreSelectOptions.nth(categoryToPickIndex);
    const genreToPickIndex = Math.floor(Math.random() * categorySelectOptionsCount) || 1;
    const genreToPick = await genreSelectOptions.nth(genreToPickIndex);

    console.log('random', {
      categoryToPick: await categoryToPick.innerText(),
      genreToPick: await genreToPick.innerText(),
    });

    await genreSelect.selectOption({ index: genreToPickIndex });
    await categorySelect.selectOption({ index: categoryToPickIndex });

    const searchButton = await page.locator('#search');
    await searchButton.click();

    const { items, genre, category } = await getItemsInPage(page);
    const itemsCount = await items.count();

    console.log({ itemsCount });

    noItemsFound = itemsCount === 0;

    if (!noItemsFound) {
      try {
        itemDataArray = await getItemDataArray(items, { category, genre });
      } catch (error) {
        console.log('no items were found', { error });
      }
    }
  }

  return itemDataArray;
};

const downloadFromPages = async ({ page, context }) => {
  const pages = process.env.PAGE_URLS.split(',').filter((pageString) => pageString);

  console.log({ pages });
  let storedItems = [];

  for (let i = 0; i < pages.length; i += 1) {
    const currentUrl = pages[i];

    console.log({ currentUrl });

    await page.goto(currentUrl);

    const { items, genre, category } = await getItemsInPage(page);

    console.log({
      genre, category,
    });

    try {
      await items.first().waitFor({ state: 'visible', timeout: 3000 });

      const numberOfItems = await items.count();

      console.log({ numberOfItems });

      const itemDataArray = await getItemDataArray(items, { category, genre });

      storedItems = [...storedItems, ...itemDataArray];
    } catch (error) {
      console.log('no items were found', { error });
    }
  }

  // get random items
  const randomItems = await getRandomItems(page);
  storedItems = [...storedItems, ...randomItems];

  for (let j = 0; j < storedItems.length; j += 1) {
    const item = storedItems[j];
    const { category, genre } = item;

    const result = await downloadItem({
      context, item, category, genre,
    });

    if (result === 'error') {
      storedItems = storedItems.slice(j);
      return {
        hasHitLimit: true,
        storedItems,
      };
    }
  }

  return {
    hasHitLimit: false,
    storedItems,
  };
};

module.exports = {
  getItemDataArray,
  downloadItem,
  downloadFromPages,
};
