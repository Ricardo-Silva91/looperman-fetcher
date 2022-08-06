# looperman-fetcher
selenium script for searching and downloading files from looperman

## Contents

 - [Getting Started](#getting-started)


 ## Getting Started

 In order for the script to work, you need to have [selenium-webdriver](https://www.selenium.dev/documentation/getting_started/) set up on your system.
 
 Next, you will need to create the `.env` file for your project.\
 start by copying the `.env.sample` file:

```
cp .env.sample .env
```

 Then, on the new `.env` file, fill the following fields:
 
 | name | description | default |
 |------|-------------|---------|
 | CHROME_PATH | full path to the chrome (or brave) executable to use. | - |
 | PROFILE_PATH | full path to the profile directory (can be empty, the profile will create itself if it doesn't exist).  | - |
 | PROFILE_NAME | profile name. | default |
 
 Now, you can run the script:

```
npm run start
```
 
 This time, the browser will open but nothing will happen 😥.\
That's because you need to setup the download directory, so go to the browser setting and setup the path for the downloads and make sure 'Ask where to save each file before downloading' is off.\
Close the browser and now you can fill the rest of the `.env` variables, just make sure `TRIAGE_PATH` matches the path you set in the browser setting 😉.
 

 | name | description | default |
 |------|-------------|---------|
 | CHROME_PATH | full path to the chrome (or brave) executable to use. | - |
 | PROFILE_PATH | full path to the profile directory (can be empty, the profile will create itself if it doesn't exist).  | - |
 | PROFILE_NAME | profile name. | default |
 | LANDING_URL | landing url for the script. | https://www.looperman.com |
 | PAGE_URLS | pages to download from (separated by ',') | https://www.looperman.com/loops?page=1&cid=1&when=3&order=date&dir=d |
 | LOOPERMAN_EMAIL | user email to login. | - |
 | LOOPERMAN_PASSWORD | user password to login. | - |
 | BLACKLISTED_TERMS | words/phrases used to blacklist an item (if they are found in the item's title, description, author or tags, the item will not be downloaded). | 808, trap, deep house, techno, trap, hardcore, hardstyle |
 | WHITELISTED_TERMS | words/phrases used to whitelist an item, these items are stored in the 'goodies' directory (only applies to not blacklisted items). | boombap, boom bap,oldschool |
 | GOODIES_PATH | path to the directory where whitelisted items will be stored. | - |
 | MAYBES_PATH | path to the directory where not blacklisted items will be stored. | - |
 | TRIAGE_PATH | path to the directory where downloads will be stored. (same as the one set in the browser) | - |
 
