const path = require('path');
const { moveFile } = require('./fs.utils');
const { getTextOfElement } = require('./playwright-helpers/utils/browser.utils');

const getItemDataArray = async (items) => {
  const itemDataArray = [];
  const numberOfItems = await items.count();

  for (let i = 0; i < numberOfItems; i += 1) {
    const item = await items.nth(i);
    const title = await getTextOfElement({ page: item, query: '.player-title' });
    const author = await getTextOfElement({ page: item, query: '.icon-small.icon-user' });
    const href = await item.locator('.player-title').getAttribute('href');
    const id = href.replace('https://www.looperman.com/loops/detail/', '').split('/')[0];

    const filename = `${`${id}-${author}-${title}`.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 100)}.wav`;

    itemDataArray.push({
      id,
      title,
      author,
      href,
      filename,
    });
  }

  return itemDataArray;
};

const downloadItem = async ({
  page, item, category, genre,
}) => {
  const { href, title, filename } = item;

  console.log({ href });

  await page.goto(href);

  const downloadButtons = await page.locator('.player-wrapper .player-big-btn.btn-download');
  const downloadButton = await downloadButtons.first();

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    downloadButton.click(),
  ]);

  console.log('will wait for', title);

  const downloadPath = await download.path();

  console.log({ downloadPath });

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
};

module.exports = {
  getItemDataArray,
  downloadItem,
};
