var authorUtils = require('./authorUtils');
var pathUtils = require('./pathUtils');

var { readFile, writeFile } = require('../util');

async function updateJSON(path, ...objects) {
  var contents = null;
  try {
    contents = JSON.stringify(await readFile(path));
  } catch (e) {
    throw new Error('File missing or not JSON at ' + path + '.');
  }

  contents = contents || {};
  var newContents = Object.assign({}, contents, ...objects);
  await writeFile(JSON.stringify(newContents), 'utf8');

  return newContents;
}

module.exports = {
  authorUtils, pathUtils, updateJSON
};
