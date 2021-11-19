/* eslint-disable no-await-in-loop */
const fs = require('fs');

const moveFile = (oldPath, newPath) => new Promise((resolve) => {
  fs.rename(oldPath, newPath, () => {
    resolve();
  });
});

const createDirIfNecessary = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

const fsUtils = {
  moveFilesToDir: async (items, targetDir, sectionTitle) => {
    const triageDir = process.env.TRIAGE_PATH;
    let fileList = [];
    const movedFiles = [];
    const ids = items.map((item) => item.id);

    for (let i = 0; i < ids.length; i += 1) {
      fileList = fs.readdirSync(triageDir);
      const id = ids[i];

      const matchedFile = fileList.find((file) => file.includes(id));

      if (matchedFile) {
        createDirIfNecessary(`${targetDir}/${sectionTitle}`);
        await moveFile(`${triageDir}/${matchedFile}`, `${targetDir}/${sectionTitle}/${matchedFile}`);
        movedFiles.push(id);
      }
    }

    return movedFiles;
  },
  saveToFile: (items) => {
    fs.writeFile('test.js', `
    const mockItems = ${JSON.stringify(items)};

    module.exports = {
      mockItems,
    };
    
    `, (err) => {
      if (err) return console.log(err);
      console.log('Hello World > helloworld.txt');
      return 0;
    });
  },
  saveState: (allItems) => {
    fs.writeFile('state.js', `
    const allSavedItems = ${JSON.stringify(allItems)};

    module.exports = {
      allSavedItems,
    };
    
    `, (err) => {
      if (err) return console.warn('error saving state');
      console.log('state.js updated');
      return 0;
    });
  },
};

module.exports = {
  ...fsUtils,
};
