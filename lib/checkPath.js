var path = require('path');

var utils = require('../util');
var { readdir } = utils;

/**
 * This function checks if something is on the path, like which
 */
async function checkPath(name, envPath) {
  envPath = envPath || process.env.PATH;
  var dirs = envPath.split(path.delimiter);
  var folders = await Promise.all(dirs.map(async d => {
    var files = null;
    try { files = await readdir(d); } catch (e) {}
    return { path: d, files };
  }));

  for (var i = 0; i < folders.length; i++) {
    var folder = folders[i];

    if (!folder.files)
      continue;

    for (var j = 0; j < folder.files.length; j++) {
      var file = folder.files[j];
      if (file === name)
        return path.join(folder.path, name);
    }
  }

  return false;
}

module.exports = checkPath;
