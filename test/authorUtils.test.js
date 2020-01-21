var { expect } = require('chai');
var path = require('path');
var os = require('os');
var tmp = require('tmp-promise');

var { getAuthorInfo, util } = require('..');
var { copyFile, exists, readFile, unlink, writeFile } = util;

var fixture = path.join.bind(path, __dirname, 'fixtures');

describe('getAuthorInfo', () => {
  var local, oldLocal = null;
  var global, oldGlobal = null;

  before(async () => {
    local = path.join(os.homedir(), '.gitconfig');
    if (await exists(local))
      oldLocal = await readFile(local, 'utf8');

    global = path.resolve(process.cwd(), '.git/config');
    if (await exists(global))
      oldGlobal = await readFile(global, 'utf8');

    await copyFile(fixture('.gitconfig'), global);
  });

  after(async () => {
    if (oldLocal) await writeFile(local, oldLocal, 'utf8');
    if (oldGlobal) await writeFile(local, oldGlobal, 'utf8');
  });

  it('should find information with no remotes', async () => {
    await copyFile(fixture('config_none'), local);
    var result = await getAuthorInfo();
    expect(result).to.eql({
      author: 'David Ankin <daveankin@gmail.com>'       
    });
  });

  it('should find information with origin remote', async () => {
    await copyFile(fixture('config_multiple'), local);
    var result = await getAuthorInfo();
    expect(result).to.eql({
      author: 'David Ankin <daveankin@gmail.com>',
      repository: { url: 'git@github.com:username/origin', type: 'git' }       
    });
  });

  it('should find information with multiple remotes', async () => {
    await copyFile(fixture('config_no_origin'), local);
    var result = await getAuthorInfo();
    expect(result).to.eql({
      author: 'David Ankin <daveankin@gmail.com>',
      repository: { url: 'git@github.com:username/other', type: 'git' }       
    });
  });
});
