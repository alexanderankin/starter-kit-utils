var { expect } = require('chai');
var path = require('path');
var tmp = require('tmp-promise');

require('chai').use(require('chai-as-promised'))

var { addDeps, getDeps, updateJSON, util } = require('..');
var { unlink, readFile, writeFile } = util;

var fixture = path.join.bind(path, __dirname, 'fixtures');
var read = async name => JSON.parse(await readFile(name, 'utf8'));
var write = async (name, o) =>
  await writeFile(name, JSON.stringify(o), 'utf8');

var sinon = require('sinon');
var { valid } = require('semver');

describe('addDeps', () => {
  it('should add deps and devDeps', () => {
    var deps = [{name:'a', version:'0.0.1'}, {name:'b', version:'1.0.1'}];
    expect(addDeps({}, deps, false)).to.eql({
      dependencies: { a: '0.0.1', b: '1.0.1' }
    });

    expect(addDeps({}, deps, true)).to.eql({
      devDependencies: { a: '0.0.1', b: '1.0.1' }
    });
  });  
});

describe('getDeps', () => {
  var sandbox;

  before(() => {
    sandbox = sinon.createSandbox();
    var pacote = require('pacote');
    sandbox.stub(pacote, 'manifest');
    pacote.manifest.returns({ version: '0.0.1' });
  });

  after(() => sandbox.restore());

  it('should fetch versions', async () => {
    var deps = [ 'dotenv' ];
    var versions = await getDeps(deps);

    expect(versions).to.have.length(1);
    expect(versions[0]).to.have.property('name');
    expect(versions[0].name).to.equal('dotenv');
    expect(versions[0]).to.have.property('version');
    expect(versions[0].version).to.equal('0.0.1');
    expect(valid(versions[0].version)).to.be.ok;
  });
});

describe('updateJSON', () => {
  var dir, dirFile;

  before(async () => {
    dir = await tmp.dir({ unsafeCleanup: true });
    dirFile = path.join.bind(path, dir.path);
    await write(dirFile('file.json'), { a: true });
  });

  after(async () => await dir.cleanup());

  it('should error when missing file', async () => {
    await expect(updateJSON('dne', {})).to.be.rejectedWith('missing');
  });

  it('should work', async () => {
    var value = await updateJSON(dirFile('file.json'), { a: 4 });
    expect(value).to.eql({ a: 4 });

    value = await updateJSON(dirFile('file.json'), { b: null, a: 5 });
    expect(await read(dirFile('file.json'))).to.eql({ b: null, a: 5 });
    expect(value).to.eql({ b: null, a: 5 });

    value = await updateJSON(dirFile('file.json'), { b: undefined, a: 5 });
    // goes away when serializing
    expect(await read(dirFile('file.json'))).to.eql({ a: 5 });
    // not when not serializing
    expect(value).to.eql({ b: undefined, a: 5 });
  });
});
