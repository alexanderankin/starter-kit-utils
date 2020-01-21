var { authorUtils, pathUtils, updateJSON } = require('./lib');
var { checkManagers, checkPath } = pathUtils;
var { getAuthorInfo } = authorUtils;
var util = require('./util');

module.exports = {
  authorUtils,
  checkManagers,
  checkPath,
  getAuthorInfo,
  pathUtils,
  updateJSON,
  util
};
