var { expect } = require('chai');
var path = require('path');
var tmp = require('tmp-promise');

var { pathUtils, util } = require('..');
var { checkPath } = pathUtils;

describe('checkPath', () => {
  var oldEnvPath;
  var directory;

  before(async () => {
    directory = await tmp.dir({ unsafeCleanup: true });

    oldEnvPath = process.env.PATH;
    process.env.PATH = process.env.PATH
      .split(path.delimiter)
      .concat(directory.path)
      .join(path.delimiter);

    var unusual = path.join(directory.path, 'unusual_bin_name');
    await util.writeFile(unusual, '.', 'utf8');
  });

  after(async () => {
    process.env.PATH = oldEnvPath;
    if (directory)
      await directory.cleanup();
  });

  it('should find something in the path', async () => {
    expect(await checkPath('unusual_bin_name')).to.be.ok;
  });

  it('should not find something not in the path', async () => {
    expect(await checkPath('unusual_bin_namea')).to.be.false;
  });
});
