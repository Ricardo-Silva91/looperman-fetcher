const { until, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { Builder } = require('selenium-webdriver');

const iterationWaitTime = 1000;
const waitTimeout = 10000;

const getDriver = async () => {
  const options = new chrome.Options();
  options.setBinaryPath(process.env.CHROME_PATH);

  options.addArguments(`user-data-dir=${process.env.PROFILE_PATH}`);
  options.addArguments(`profile-directory=${process.env.PROFLE_NAME}`);

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  return driver;
};

const waitFor = async (timeToWait = iterationWaitTime) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, timeToWait);
});

const waitAndRepeat = async (driver, condition) => {
  await driver
    .wait(
      until.elementLocated(By.xpath(condition)),
      waitTimeout,
      `Timed out after ${waitTimeout / 1000} seconds`,
      1000,
    )
    .catch(async () => {
      console.warn('element', condition, 'not found, refreshing');
      await driver.navigate().refresh();

      await driver
        .wait(
          until.elementLocated(By.xpath(condition)),
          waitTimeout,
          `Timed out after ${waitTimeout / 1000} seconds`,
          1000,
        )
        .catch(() => {
          console.warn('giving up');
          driver.quit();
        });
    });
};

const checkForElement = async (driver, elementPath, times = 3) => {
  for (let i = 0; i < times; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const elementArray = await driver.findElements(By.xpath(elementPath));

    if (elementArray.length) {
      return elementArray[0];
    }

    // eslint-disable-next-line no-await-in-loop
    await waitFor();
  }

  return false;
};

const getAllElements = async (driver, elementPath, times = 3) => {
  for (let i = 0; i < times; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const elementArray = await driver.findElements(By.xpath(elementPath));

    if (elementArray.length) {
      return elementArray;
    }

    // eslint-disable-next-line no-await-in-loop
    await waitFor();
  }

  return [];
};

module.exports = {
  getDriver,
  checkForElement,
  getAllElements,
  waitAndRepeat,
  waitFor,
};
