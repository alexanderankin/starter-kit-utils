var pathUtils = require('./lib/pathUtils');
var util = require('./util');

module.exports = {
  pathUtils, util,
  checkManagers: pathUtils.checkManagers,
  checkPath: pathUtils.checkPath
};
