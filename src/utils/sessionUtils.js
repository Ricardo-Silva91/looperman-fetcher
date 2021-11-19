/* eslint-disable no-await-in-loop */

const { checkForElement } = require('./driverUtils');
const {
  agreeButtonPath,
  myProfileButtonPath,
  loginButtonPath,
  usernameInputPath,
  passwordInputPath,
  disclaimerInputPath,
  loginSubmitButtonPath,
  bodyPath,
} = require('./elementPaths');

const sessionUtils = {
  dealWithCookiePolicy: async (driver) => {
    const agreeButton = await checkForElement(driver, agreeButtonPath);

    if (agreeButton) {
      await agreeButton.click();
    }
  },
  dealWithLogin: async (driver) => {
    let myProfileButton = await checkForElement(driver, myProfileButtonPath);

    if (!myProfileButton) {
      const loginButton = await checkForElement(driver, loginButtonPath);

      loginButton.click();

      const usernameInput = await checkForElement(driver, usernameInputPath);
      const passwordInput = await checkForElement(driver, passwordInputPath);
      const disclaimerInput = await checkForElement(driver, disclaimerInputPath);

      if (usernameInput) {
        usernameInput.sendKeys(process.env.LOOPERMAN_EMAIL);
        passwordInput.sendKeys(process.env.LOOPERMAN_PASSWORD);
        await disclaimerInput.click();

        const loginSubmitButton = await checkForElement(driver, loginSubmitButtonPath);

        loginSubmitButton.click();

        myProfileButton = await checkForElement(driver, myProfileButtonPath);

        if (!myProfileButton) {
          driver.close();
          return;
        }

        await driver.get(process.env.LANDING_URL);
      }
    }
  },
  wasDownloadLimitReached: async (driver) => {
    const bodyElement = await checkForElement(driver, bodyPath);
    const bodyText = await bodyElement.getAttribute('innerText');
    const checkString = 'Sorry, due to high demand, download limits are in place and you have reached the limit.\nTry again in 24 hours.';

    return bodyText === checkString;
  },
};

module.exports = {
  ...sessionUtils,
};
