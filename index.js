var authorUtils = require('./lib/authorUtils');
var pathUtils = require('./lib/pathUtils');
var util = require('./util');

module.exports = {
  authorUtils, pathUtils, util,
  checkManagers: pathUtils.checkManagers,
  checkPath: pathUtils.checkPath,
  getAuthorInfo: authorUtils.getAuthorInfo
};
