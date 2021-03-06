const fs = require('fs');
const {parseString} = require('xml2js');
require('colors');

const files = [
  'src/assets/Data/Config/biomes.xml',
  'src/assets/Data/Config/blocks.xml',
  'src/assets/Data/Config/items.xml',
  'src/assets/Data/Config/item_modifiers.xml',
  'src/assets/Data/Config/progression.xml',
  'src/assets/Data/Config/recipes.xml'
];
Promise
  .all(files.map(file => generateJsonFromXml(file)))
  .then(results => {
    console.log('FINISHED'.green);
  });

function generateJsonFromXml(input) {
  const output = input + '.json';

  return new Promise((resolve, reject) => {
    console.log(input + ' : reading...'.grey);
    fs.readFile(input, (err, xmlContent) => {
      if (err) {
        return reject(err);
      }

      console.log(input + ' : parsing...'.grey);
      parseString(xmlContent, (err, tree) => {
        if (err) {
          return reject(err);
        }
        console.log(input + ' : writting json...'.grey);
        fs.writeFile(output, JSON.stringify(tree, null, 2), err => {
          if (err) {
            return reject(err);
          }
          console.log(output + ' GENERATED'.green);
          return resolve(tree);
        })
      });

    });
  });

}
