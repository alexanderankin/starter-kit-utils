var authorUtils = require('./authorUtils');
var pathUtils = require('./pathUtils');
var updateUtils = require('./updateUtils');
var { addDeps, updateJSON } = updateUtils;

var { readFile, writeFile } = require('../util');

module.exports = {
  authorUtils, pathUtils, updateJSON
};
