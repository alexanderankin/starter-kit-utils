var path = require('path');

var utils = require('../util');
var { readdir } = utils;

var pms = [ 'npm', 'npm.exe', 'yarn', 'yarn.exe']

async function checkPackageManagers(name, envPath) {
  var has = await Promise.all(pms.map(p => checkPath(p, false)));
  return { npm: has[0] || has[1], yarn: has[2] || has[3] };
}

/**
 * This function checks if something is on the path, like which
 */
async function checkPath(name, envPath, insensitive) {
  if (insensitive === undefined)
    insensitive = process.platform === 'win32';

  if (insensitive) name = name.toLowerCase();

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
      if ((insensitive ? file.toLowerCase() : file) === name)
        return path.join(folder.path, name);
    }
  }

  return false;
}

module.exports = {
  checkPackageManagers, checkPath
};
