var path = require('path');

var utils = require('../util');
var { readdir } = utils;

var pms = [ 'npm', 'npm.exe', 'yarn', 'yarn.exe' ];

/**
 * Check Managers
 * 
 * This function will check if any of the files in the directories in the
 * environment PATH variable insensitively match npm or yarn, or their
 * Windows variants, `npm.exe` or `yarn.exe`.
 * 
 * @return { npm: Boolean, yarn: Boolean }
 */
async function checkManagers() {
  var has = await Promise.all(pms.map(p => checkPath(p, false)));
  return { npm: has[0] || has[1], yarn: has[2] || has[3] };
}

/**
 * Check Path
 * 
 * This function checks if something is on the path, like which.
 * 
 * If the third argument, insensitive is not given, it is set to whether we
 * are on windows.
 * 
 * @param name string the name of the thing to look for
 * @param envPath string variable to use instead of `process.env`
 * @param insensitive Boolean should the path check be insensitive
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
  checkManagers, checkPath
};
