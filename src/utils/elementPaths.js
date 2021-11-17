const paths = {
  agreeButtonPath: './/button[@mode="primary"]',
  loginButtonPath: './/a[@href="https://www.looperman.com/account/login"]',
  usernameInputPath: './/input[@id="user_email"]',
  passwordInputPath: './/input[@id="upass"]',
  disclaimerInputPath: './/input[@id="user_disclaimer"]',
  loginSubmitButtonPath: './/button[@id="submit"]',
};

module.exports = {
  ...paths,
};
