var getGitConfigPath = require('git-config-path');
var parseGitConfig = require('parse-git-config');

var { exists, readFile } = require('../util');

/**
 * Get Author Info
 * 
 * This function gets the information about the Authorship of the project in
 * the directory given as argument.
 * 
 * Priority order: package.json, local Git, global Git
 */
async function getAuthorInfo(directory) {
  directory = directory || process.cwd();

  var info = {};

  // var hasPackage = await exists('package.json');
  // if (hasPackage)
  //   await applyPackage(info);

  var localConfig = getGitConfigPath('local');
  if (localConfig)
    await applyGit(localConfig, info);

  var globalConfig = getGitConfigPath('global');
  if (globalConfig)
    await applyGit(globalConfig, info);

  return info;
}

// async function applyPackage(info) {
//   var pkg = JSON.stringify(await readFile('package.json'));
//   if (pkg.repository) {
//     if (typeof pkg.repository === 'string')
//       info.repository = pkg.repository;
//     else if (typeof pkg.repository === 'object' && pkg.repository.url)
//       info.repository = pkg.repository.url;
//   }

//   if (pkg.author)
//     info.author = pkg.author;
//   if (pkg.license)
//     info.license = pkg.license;
// }

var remoteName = /remote "(.*)"/;
async function applyGit(configPath, info) {
  var config = await parseGitConfig({ path: configPath });
  // console.log(configPath, 'config', config);

  // if local, find remotes
  var remoteKeys = Object.keys(config).filter(k => k.startsWith('remote'));
  var remotes = remoteKeys.reduce((remotes, key) => {
    var nameArray = remoteName.exec(key);
    if (nameArray != null) {
      var name = nameArray[1];
      remotes[name] = config[key];
    }

    return remotes;
  }, {});

  // if have remotes
  if (remotes.origin) {
    info.repository = { url: remotes.origin.url, type: 'git' };
  } else {
    var keys = Object.keys(remotes);
    if (keys.length)
      info.repository = { url: remotes[keys[0]].url, type: 'git' };
  }

  // not sure where this is from, needs reference
  // if (config.github && config.github.user) {
  //   info.author = config.github.user
  // }

  if (config.user && config.user.email && config.user.name) {
    info.author = config.user.name + ' <' + config.user.email + '>';
  }
}

module.exports = { getAuthorInfo };
