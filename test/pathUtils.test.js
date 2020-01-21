var { expect } = require('chai');
var path = require('path');
var tmp = require('tmp-promise');

var { pathUtils, util } = require('..');
var { checkPackageManagers, checkPath } = pathUtils;
var { unlink, writeFile } = util;

// Create File
var cF = async (dir, n) => await writeFile(path.join(dir, n), '.', 'utf8');
var un = async (dir, n) => await unlink(path.join(dir, n));

describe('has yarn npm', () => {
  var dir, oldEnvPath;

  before(async () => {
    dir = await tmp.dir({ unsafeCleanup: true });
    oldEnvPath = process.env.PATH;
    process.env.PATH = dir.path;
  });

  after(async () => { await dir.cleanup(); process.env.PATH = oldEnvPath });

  it('should find npm, yarn', async () => {
    var p = path.join.bind(path, dir.path);

    var result = await checkPackageManagers('npm');
    expect(result).to.eql({ npm: false, yarn: false });
    await cF(dir.path, 'npm');

    result = await checkPackageManagers('npm');
    expect(result).to.eql({ npm: p('npm'), yarn: false });

    result = await checkPackageManagers('yarn');
    expect(result).to.eql({ npm: p('npm'), yarn: false });
    await cF(dir.path, 'yarn');

    result = await checkPackageManagers('yarn');
    expect(result).to.eql({ npm: p('npm'), yarn: p('yarn') });

    await un(dir.path, 'npm');
    await un(dir.path, 'yarn');

    result = await checkPackageManagers('npm');
    expect(result).to.eql({ npm: false, yarn: false });
    await cF(dir.path, 'npm.exe');

    result = await checkPackageManagers('npm');
    expect(result).to.eql({ npm: p('npm.exe'), yarn: false });

    result = await checkPackageManagers('yarn');
    expect(result).to.eql({ npm: p('npm.exe'), yarn: false });
    await cF(dir.path, 'yarn.exe');

    result = await checkPackageManagers('yarn');
    expect(result).to.eql({ npm: p('npm.exe'), yarn: p('yarn.exe') });
  });
});

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

    await cF(directory.path, 'unusual_bin_name');
  });

  after(async () => {
    process.env.PATH = oldEnvPath;
    await directory.cleanup();
  });

  it('should find something in the path', async () => {
    expect(await checkPath('unusual_bin_name')).to.be.ok;
  });

  it('should not find something not in the path', async () => {
    expect(await checkPath('unusual_bin_namea')).to.be.false;
  });

  it('should ignore case find something in the path', async () => {
    expect(await checkPath('unusual_bin_NAME', false, true)).to.be.ok;
  });

  it('should ignore case not find something not in the path', async () => {
    expect(await checkPath('unusual_bin_NAMEa', false, true)).to.be.false;
  });
});
