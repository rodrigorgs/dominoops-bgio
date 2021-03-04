const fs = require("fs");
const csv = require("csv");

const parse = csv.parse;

const classesPath = "./base-classes";
const objectsPath = "./base-objects";

const parseArguments = {};

parseArguments.onRecord = (data) => {
  const values = [];

  for (const property in data) {
    values.push(data[property]);
  }

  const isDataEmpty = values.every((value, index) => {
    return value === "";
  });

  return isDataEmpty ? null : data;
};

parseArguments.options = {
  columns: true,
  skip_lines_with_empty_values: true,
  on_record: parseArguments.onRecord,
};

parseArguments.callback = (err, records) => {
  if (err) {
    console.error(`Error parsing csv!\n\n${err}`);
  }

  console.log(records);
};

const classesParser = parse(parseArguments.options, parseArguments.callback);
const objectsParser = parse(parseArguments.options, parseArguments.callback);

const classesReadStream = fs.createReadStream(
  `${__dirname}/${classesPath}.csv`,
);

const objectsReadStream = fs.createReadStream(
  `${__dirname}/${objectsPath}.csv`,
);

// const classesWriteStream = fs.createWriteStream(
//   `${__dirname}/${classesPath}.js`,
// );

// const objectsWriteStream = fs.createWriteStream(
//   `${__dirname}/${objectsPath}.js`,
// );

// const transform = csv.transform((data, cb) => {
//   let result = "{";

//   for (const property in data) {
//     result += `${property}: ${data[property] === "" ? '""' : data[property]},`;
//   }
//   result += "},";

//   console.log(result);

//   cb(result);
// });

// TODO: Write result to js file
classesReadStream.pipe(classesParser);
objectsReadStream.pipe(objectsParser);
