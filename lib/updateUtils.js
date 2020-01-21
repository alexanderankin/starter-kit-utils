var utils = require('../util');
var { readFile, writeFile } = utils;

async function addDeps(path, deps) {
}

async function updateJSON(jsonPath, ...objects) {
  var contents = null;
  try {
    contents = JSON.parse(await readFile(jsonPath, 'utf8'));
  } catch (e) {
    throw new Error('File missing or not JSON at ' + jsonPath + '.');
  }

  contents = contents || {};
  var newContents = Object.assign({}, contents, ...objects);
  await writeFile(jsonPath, JSON.stringify(newContents), 'utf8');

  return newContents;
}

module.exports = {
  addDeps, updateJSON
};
