const fs = require("fs");
const csvParse = require("csv-parse");
require("colors");

const files = [
  "src/assets/Data/Config/Localization.txt",
  "src/assets/Localization.csv"
];
Promise
  .all(files.map(file => generateJsonFromCsv(file)))
  .then(() => {
    console.log("FINISHED".green);
  });

function generateJsonFromCsv(input) {
  const output = input + ".json";

  return new Promise((resolve, reject) => {
    console.log(input + " : reading...".grey);
    fs.readFile(input, (err, csvContent) => {
      if (err) {
        return reject(err);
      }

      console.log(input + " : parsing...".grey);
      csvParse(csvContent, (err, lines) => {
        if (err) {
          return reject(err);
        }

        console.log(input + " : converting to maps...".grey);
        const headers = lines[0];
        headers[0] = headers[0].trim(); // BOM ?
        if (headers[0] !== "Key") {
          throw new Error(`Expect first header to be "Key", got "${headers[0]}"`);
        }
        lines.splice(0, 1);

        const objects = {};
        lines.forEach(line => {
          const key = line[0];
          const object = {};
          for (let i = 0; i < line.length; ++i) {
            const value = line[i];
            if (value) {
              object[headers[i]] = value;
            }
          }
          objects[key] = object;
        });

        console.log(input + " : writting json...".grey);
        fs.writeFile(output, JSON.stringify(objects, null, 2), err => {
          if (err) {
            return reject(err);
          }
          console.log(output + " GENERATED".green);
          return resolve(lines);
        });
      });

    });
  });

}
