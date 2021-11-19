const paths = {
  bodyPath: './/body',
  agreeButtonPath: './/button[@mode="primary"]',
  loginButtonPath: './/a[@href="https://www.looperman.com/account/login"]',
  usernameInputPath: './/input[@id="user_email"]',
  passwordInputPath: './/input[@id="upass"]',
  disclaimerInputPath: './/input[@id="user_disclaimer"]',
  loginSubmitButtonPath: './/button[@id="submit"]',
  myProfileButtonPath: ".//a[text() = 'My Profile']",
  pageSectionTitlePath: './/h1[contains(concat(" ",normalize-space(@class)," ")," section-title ")]',
  itemPlayerPath: './/*[contains(concat(" ",normalize-space(@class)," ")," player-wrapper ")]',
  itemPlayerTitlePath: './/*[contains(concat(" ",normalize-space(@class)," ")," player-title ")]',
  itemPlayerAuthorPath: './/a[contains(concat(" ",normalize-space(@class)," ")," icon-user ")]',
  itemPlayerDownloadButtonPath: './/a[contains(concat(" ",normalize-space(@class)," ")," btn-download ")]',
  itemTagsPath: './/*[contains(concat(" ",normalize-space(@class)," ")," tag-wrapper ")]',
  itemTagsAnchorPath: './/a',
  itemDescPath: './/*[contains(concat(" ",normalize-space(@class)," ")," desc-wrapper ")]',
  itemDescParagraphPath: './/p',
  pageLinksPath: './/*[contains(concat(" ",normalize-space(@class)," ")," pagination-links ")]',
  pageLinksNextAnchorPath: ".//a[text() = '>']",
};

module.exports = {
  ...paths,
};
