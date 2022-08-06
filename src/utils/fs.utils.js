const fs = require('fs');

const moveFile = (src, dest, neededDirs) => {
  if (fs.existsSync(src)) {
    if (neededDirs && neededDirs.length) {
      neededDirs.forEach((dir) => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
      });
    }

    fs.renameSync(src, dest);
  } else {
    console.log('file ', src, 'does not exist 😢');
  }
};

const writeFile = (dest, data) => {
  fs.writeFileSync(dest, JSON.stringify(data, null, 2));
};

const readFile = (src) => {
  if (!fs.existsSync(src)) {
    return null;
  }

  const data = fs.readFileSync(src);

  return JSON.parse(data);
};

module.exports = {
  moveFile,
  readFile,
  writeFile,
};
