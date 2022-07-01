const fs = require('fs');

const moveFile = (src, dest) => {
  if (fs.existsSync(src)) {
    fs.renameSync(src, dest);
  } else {
    console.log('file ', src, 'does not exist 😢');
  }
};

module.exports = {
  moveFile,
};
