var utils = require('../util');
var { readFile, writeFile } = utils;

var pacote = require('pacote');

/**
 * Add dependencies
 * 
 * Operates in place on an object representing a package.json manifest, adding
 * the deps to the "dependencies" or "devDependencies" sections of the object
 * 
 * @param object object the package manifest
 * @param deps array[object] dependencies in the form generate by getDeps
 * @param dev boolean development environment dependencies or production
 */
function addDeps(object, deps, dev) {
  var depKey = dev ? 'devDependencies' : 'dependencies';
  var oldDeps = object[depKey] || {};
  for (var i = 0; i < deps.length; i++) {
    var { name, version } = deps[i];
    oldDeps[name] = version;
  }

  var newDeps = {};
  Object.keys(oldDeps).sort().forEach(key => {
    newDeps[key] = oldDeps[key];
  });

  object[depKey] = newDeps;
  return object;
}

/**
 * Get Dependencies
 * 
 * Using pacote, fetch the manifest of packages, and get the version.
 */
async function getDeps(deps) {
  return await Promise.all(deps.map(async dep => {
    return {
      name: dep,
      version: (await pacote.manifest(dep)).version
    };
  }));
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
  addDeps, getDeps, updateJSON
};
