const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');
const { stdout, stderr } = require('process');

const dir = 'secret-folder';

const fullName = path.join(__dirname, dir);

const writeFile = (file) => {
  const fullName = path.join(__dirname, dir, file.name);

  fs.stat(fullName, (err, stats) => {
    if (err) stderr.write(`Error: ${err}`);
    else if (stats.isFile()) {
      let ext = path.extname(fullName).slice(1);
      let info = `${file.name} - ${ext} - ${stats.size / 1024}kb`;
      stdout.write(info + '\r\n');
    }
  });
};

async function getDirInfo() {
  try {
    const files = await fsPromises.readdir(fullName, { withFileTypes: true });
    for (const file of files) writeFile(file);
  } catch (err) {
    stderr.write(`Error: ${err}`);
  }
}

getDirInfo();