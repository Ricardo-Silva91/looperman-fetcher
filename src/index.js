/* eslint-disable no-await-in-loop */
const dotenv = require('dotenv');
const { waitFor, getDriver, checkForElement } = require('./utils/driverUtils');
const { getItemsOnPage, filterItems, downloadItems } = require('./utils/itemUtils');
const { moveFilesToDir, saveState } = require('./utils/fsUtils');
const { dealWithCookiePolicy, dealWithLogin } = require('./utils/sessionUtils');
const { pageSectionTitlePath } = require('./utils/elementPaths');
const { allSavedItems } = require('../state');

dotenv.config();

(async function run() {
  const driver = await getDriver();

  await driver.get(process.env.LANDING_URL);

  await dealWithCookiePolicy(driver);

  await dealWithLogin(driver);

  const pagesUrls = process.env.PAGE_URLS.split(/, |,/);
  const allItems = allSavedItems || {};
  const savedKeys = Object.keys(allItems).length;

  if (savedKeys) {
    console.log('has saved items');
  }

  for (let i = 0; i < pagesUrls.length && !savedKeys; i += 1) {
    const pageUrl = pagesUrls[i];

    await driver.get(pageUrl);

    const sectionTitleElement = await checkForElement(driver, pageSectionTitlePath);
    const sectionTitleAttribute = await sectionTitleElement.getAttribute('innerText');
    const sectionTitle = sectionTitleAttribute.replace('Free', '').replace('Music Loops & Samples', '').trim().replace(/ /g, '-');

    const items = await getItemsOnPage(driver);

    const { goodies, maybes } = filterItems(items);

    console.log({ sectionTitle, gl: goodies.length, ml: maybes.length });

    allItems[sectionTitle] = { goodies, maybes };
  }

  const keys = Object.keys(allItems);

  for (let i = 0; i < keys.length; i += 1) {
    const sectionTitle = keys[i];
    const { goodies, maybes } = allItems[sectionTitle];
    let donwloadLimitReachedStatus = {};

    if (goodies.length) {
      donwloadLimitReachedStatus = await downloadItems(driver, goodies);

      if (donwloadLimitReachedStatus.donwloadLimitReached) {
        allItems[sectionTitle].goodies = goodies.slice(donwloadLimitReachedStatus.currentIndex);
        saveState(allItems);
      }
    }

    if (maybes.length && !donwloadLimitReachedStatus.donwloadLimitReached) {
      donwloadLimitReachedStatus = await downloadItems(driver, maybes);

      if (donwloadLimitReachedStatus.donwloadLimitReached) {
        allItems[sectionTitle].maybes = maybes.slice(donwloadLimitReachedStatus.currentIndex);
        saveState(allItems);
      }
    }

    await waitFor(10000);

    await moveFilesToDir(maybes, process.env.MAYBES_PATH, sectionTitle);
    // allItems[sectionTitle].maybes = maybes.filter((item) => !movedFiles.includes(item.id));

    await moveFilesToDir(goodies, process.env.GOODIES_PATH, sectionTitle);
    // allItems[sectionTitle].goodies = goodies.filter((item) => !movedFiles.includes(item.id));
    // saveState(allItems);

    if (donwloadLimitReachedStatus.donwloadLimitReached) {
      driver.close();
      return;
    }
  }
  saveState({});
  driver.close();
}());
