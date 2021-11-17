const dotenv = require('dotenv');
const chrome = require('selenium-webdriver/chrome');
const { Builder } = require('selenium-webdriver');
const { checkForElement } = require('./utils/driverUtils');
const {
  agreeButtonPath, loginButtonPath, usernameInputPath, passwordInputPath, disclaimerInputPath,
} = require('./utils/elementPaths');

dotenv.config();

(async function run() {
  const options = new chrome.Options();
  options.setBinaryPath(process.env.CHROME_PATH);
  
//   options.addArguments(`user-data-dir=${driverOptions.dataDir}`);
//   options.addArguments(`profile-directory=${driverOptions.profile}`);

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  await driver.get('https://www.looperman.com/loops?page=1&cid=1&when=3&order=date&dir=d');

  const agreeButton = await checkForElement(driver, agreeButtonPath);

  if (agreeButton) {
    agreeButton.click();
  }

  const loginButton = await checkForElement(driver, loginButtonPath);

  if (loginButton) {
    loginButton.click();
  }

  const usernameInput = await checkForElement(driver, usernameInputPath);
  const passwordInput = await checkForElement(driver, passwordInputPath);
  const disclaimerInput = await checkForElement(driver, disclaimerInputPath);

  if (usernameInput) {
    usernameInput.sendKeys(process.env.LOOPERMAN_EMAIL);
    passwordInput.sendKeys(process.env.LOOPERMAN_PASSWORD);
    disclaimerInput.click();
  }
}());
