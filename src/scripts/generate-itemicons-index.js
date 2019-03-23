const fs = require('fs');
require('colors');

const INPUT_DIR = 'src/assets/ItemIcons';
const INDEX_FILE = 'src/assets/ItemIcons/index.json';

async function main() {
  console.log(INPUT_DIR + ' : listing images...'.grey);
  const filenames = await readdir();
  console.log(INPUT_DIR + ` : ${filenames.length} images listed`.green);
  await writeIndex(filenames);
  console.log(INDEX_FILE + ' GENERATED'.green);
  console.log('FINISHED'.green);
}

function readdir() {
  return new Promise((resolve, reject) =>
    fs.readdir(INPUT_DIR, (err, filenames) =>
      err ? reject(err) : resolve(filenames)))
}

function writeIndex(filenames) {
  return new Promise((resolve, reject) =>
    fs.writeFile(INDEX_FILE, JSON.stringify(filenames), (err) =>
      err ? reject(err) : resolve()))
}

main();
