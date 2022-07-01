const fs = require('fs');

const moveFile = (src, dest, dir) => {
  if (fs.existsSync(src)) {
    if (dir && !fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    fs.renameSync(src, dest);
  } else {
    console.log('file ', src, 'does not exist 😢');
  }
};

module.exports = {
  moveFile,
};
