const { getTextOfElement } = require('./playwright-helpers/utils/browser.utils');

const getItemDataArray = async (items) => {
  const itemDataArray = [];
  const numberOfItems = await items.count();

  for (let i = 0; i < numberOfItems; i += 1) {
    const item = await items.nth(i);
    const title = await getTextOfElement({ page: item, query: '.player-title' });

    itemDataArray.push({
      title,
    });
  }

  return itemDataArray;
};

module.exports = {
  getItemDataArray,
};
