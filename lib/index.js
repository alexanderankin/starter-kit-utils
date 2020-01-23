var authorUtils = require('./authorUtils');
var { getAuthorInfo } = authorUtils;

var pathUtils = require('./pathUtils');
var { checkManagers, checkPath } = pathUtils;

var updateUtils = require('./updateUtils');
var { addDeps, getDeps, updateJSON } = updateUtils;

var renderFolder = require('./renderFolder');

module.exports = {
  getAuthorInfo,
  checkManagers,
  checkPath,
  updateJSON,
  addDeps,
  getDeps,
  updateJSON,
  renderFolder
};
