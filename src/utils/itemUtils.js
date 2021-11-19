/* eslint-disable no-await-in-loop */
const { getAllElements, checkForElement, waitFor } = require('./driverUtils');
const {
  itemPlayerPath,
  itemTagsPath,
  itemDescPath,
  itemPlayerTitlePath,
  itemTagsAnchorPath,
  itemDescParagraphPath,
  itemPlayerDownloadButtonPath,
  itemPlayerAuthorPath,
  pageLinksPath,
  pageLinksNextAnchorPath,
} = require('./elementPaths');
const { wasDownloadLimitReached } = require('./sessionUtils');

const itemIsBlackListed = (itemText) => {
  const blackListedTerms = process.env.BLACKLISTED_TERMS.split(/, |,/);

  for (let j = 0; j < blackListedTerms.length; j += 1) {
    const term = blackListedTerms[j];

    if (itemText.includes(term.toLocaleLowerCase())) {
      return true;
    }
  }

  return false;
};

const itemIsWhiteListed = (itemText) => {
  const whitelistedTerms = process.env.WHITELISTED_TERMS.split(/, |,/);

  for (let j = 0; j < whitelistedTerms.length; j += 1) {
    const term = whitelistedTerms[j];

    if (itemText.includes(term.toLocaleLowerCase())) {
      return true;
    }
  }

  return false;
};

const printState = (index, length) => {
  const percentage = index / length;

  switch (percentage) {
    case 0:
      console.log(`starting download of ${length} items`);
      break;
    case 0.25:
      console.log(`${percentage * 100}% done`);
      break;
    case 0.5:
      console.log(`${percentage * 100}% done`);
      break;
    case 0.75:
      console.log(`${percentage * 100}% done`);
      break;

    default:
      break;
  }
};

const itemÛtils = {
  getItemsOnPage: async (driver) => {
    const finalList = [];
    let isLastPage = false;

    do {
      const playerItems = await getAllElements(driver, itemPlayerPath);
      const tagItems = await getAllElements(driver, itemTagsPath);
      const descItems = await getAllElements(driver, itemDescPath);

      for (let i = 0; i < playerItems.length; i += 1) {
        const item = playerItems[i];
        const tags = [];
        let desc = '';

        const titleElement = await checkForElement(item, itemPlayerTitlePath);
        const title = await titleElement.getAttribute('innerText');
        const authorElement = await checkForElement(item, itemPlayerAuthorPath);
        const author = await authorElement.getAttribute('innerText');
        const downloadButtonElement = await checkForElement(item, itemPlayerDownloadButtonPath);
        const url = await downloadButtonElement.getAttribute('href');
        const id = url.split('/').pop();

        if (tagItems[i]) {
          const tagAnchors = await getAllElements(tagItems[i], itemTagsAnchorPath);

          for (let j = 0; j < tagAnchors.length; j += 1) {
            const anchor = await tagAnchors[j].getAttribute('innerText');
            tags.push(anchor);
          }
        }

        if (descItems[i]) {
          const descParagraphElement = await checkForElement(descItems[i], itemDescParagraphPath);
          desc = await descParagraphElement.getAttribute('innerText');
        }

        finalList.push({
          id,
          title,
          author,
          tags,
          desc,
          url,
        });
      }

      const pageLinksElement = await checkForElement(driver, pageLinksPath);
      const pageLinksNextAnchorElement = pageLinksElement
        && await checkForElement(pageLinksElement, pageLinksNextAnchorPath);

      if (pageLinksNextAnchorElement) {
        await pageLinksNextAnchorElement.click();
      } else {
        isLastPage = true;
      }
    } while (!isLastPage);

    return finalList;
  },
  filterItems: (items) => {
    const goodies = [];
    const maybes = [];

    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      const itemText = `${item.title} ${item.author} ${item.desc} ${item.tags.join(' ')}`.toLocaleLowerCase();

      if (!itemIsBlackListed(itemText)) {
        if (itemIsWhiteListed(itemText)) {
          goodies.push(item);
        } else {
          maybes.push(item);
        }
      }
    }

    return ({
      goodies,
      maybes,
    });
  },
  downloadItems: async (driver, items) => {
    const originalWindow = await driver.getWindowHandle();

    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];

      printState(i, items.length);
      await driver.switchTo().newWindow('tab');
      await driver.get(item.url);

      const downloadButtonElement = await checkForElement(driver, itemPlayerDownloadButtonPath);

      await downloadButtonElement.click();
      await waitFor(7000);

      const donwloadLimitReached = await wasDownloadLimitReached(driver);

      if (donwloadLimitReached) {
        console.warn('Donwload limit was reached');
        await driver.close();
        await driver.switchTo().window(originalWindow);
        return ({
          donwloadLimitReached: true,
          currentIndex: i,
        });
      }

      await driver.close();
      await driver.switchTo().window(originalWindow);
    }

    await driver.switchTo().window(originalWindow);

    return ({
      donwloadLimitReached: false,
      currentIndex: 0,
    });
  },
};

module.exports = {
  ...itemÛtils,
};
