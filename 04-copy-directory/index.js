const fsPromises = require('fs/promises');
const path = require('path');
const { stdout, stderr } = require('process');
const comStat = () => {
  const index = process.argv.indexOf('-c');
  return index === -1 ? true : !(process.argv[index + 1] === 'off');
};
const copyDir = async (dirSrc, dirDest, comStat = true) => {
  await fsPromises.rm(dirDest, { recursive: true, force: true });
  await fsPromises.mkdir(dirDest, { recursive: true });
  const files = await fsPromises.readdir(dirSrc, { withFileTypes: true });
  for (const file of files) {
    let pathSrcNew = path.join(dirSrc, file.name);
    let pathDestNew = path.join(dirDest, file.name);
    if (file.isFile()) {
      if (comStat) stdout.write(`copy ${pathSrcNew} -> ${pathDestNew}\r\n`);
      await fsPromises.copyFile(pathSrcNew, pathDestNew);
    } else {
      if (comStat) stdout.write(`copy dir ${pathSrcNew} -> ${pathDestNew}\r\n`);
      await copyDir(pathSrcNew, pathDestNew, comStat);
    }
  }
  return true;
};

const dirSrc = path.join(__dirname, 'files');
const dirDest = path.join(__dirname, 'files-copy');
(async () => {
  try {
    await copyDir(dirSrc, dirDest, comStat());
    stdout.write('Done. New directory is ' + dirDest);
  } catch (err) {
    stderr.write('Failed. ' + err);
  }
})();
