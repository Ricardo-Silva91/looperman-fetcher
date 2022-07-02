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

module.exports = {
  moveFile,
};
