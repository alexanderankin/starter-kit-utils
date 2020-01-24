var { expect } = require('chai');
var tmp = require('tmp-promise');

var path = require('path');
var os = require('os');

var { generateCopyList, generateCopyListRecursive, renderFile } = require('../lib/renderFolder');
var { renderFolder, util } = require('..');
var { copyFile, exists, readFile, unlink, writeFile } = util;

var fixture = path.join.bind(path, __dirname, 'fixtures');

describe('renderFolder', () => {
  describe.skip('errors'); // is this project rly mature enough for this test?

  describe('does it render folders', () => {
    var dir, direntry;

    before(async () => {
      dir = await tmp.dir({ unsafeCleanup: true });
      direntry = path.join.bind(path, dir.path);
      // await renderFolder
    });

    after(async () => await dir.cleanup());

    it('should render a single file', async () => {
      var locals = { project: { camelName: 'myProject' } };
      await renderFile(fixture('README.md.ejs'), direntry('README.md'), locals);
      
      var should = await readFile(fixture('README.md'), 'utf8');
      var output = await readFile(direntry('README.md'), 'utf8');

      expect(output).to.equal(should);
    });

    it('should render a folder', async () => {
      var locals = { a: 1, b: 'ok', c: null };
      await renderFolder(fixture('template1'), direntry('src'), locals);

      expect(await readFile(direntry('src', 'a'), 'utf8')).to.equal('1');
      expect(await readFile(direntry('src', 'b'), 'utf8')).to.equal('ok');
      expect(await readFile(direntry('src', 'c'), 'utf8')).to.equal('');
      expect(await readFile(direntry('src', 'd', 'e'), 'utf8')).to.equal('1');
      expect(await readFile(direntry('src', 'd', 'f'), 'utf8')).to.equal('ok');
      expect(await readFile(direntry('src', 'd', 'g'), 'utf8')).to.equal('');
      expect(await readFile(direntry('src', 'h', 'i'), 'utf8')).to.equal('1');
      expect(await readFile(direntry('src', 'h', 'j'), 'utf8')).to.equal('ok');
      expect(await readFile(direntry('src', 'h', 'k'), 'utf8')).to.equal('');
    });
  });

  describe('helper functions', () => {
    it('should find all files in a template', async () => {
      var copyList = await generateCopyList(fixture('template1'));

      expect(copyList).to.eql([
        { from: fixture('template1', 'a'),      relativeTo: 'a' },
        { from: fixture('template1', 'b'),      relativeTo: 'b' },
        { from: fixture('template1', 'c'),      relativeTo: 'c' },
        { from: fixture('template1', 'd', 'e'), relativeTo: 'd/e' },
        { from: fixture('template1', 'd', 'f'), relativeTo: 'd/f' },
        { from: fixture('template1', 'd', 'g'), relativeTo: 'd/g' },
        { from: fixture('template1', 'h', 'i'), relativeTo: 'h/i' },
        { from: fixture('template1', 'h', 'j'), relativeTo: 'h/j' },
        { from: fixture('template1', 'h', 'k'), relativeTo: 'h/k' }
      ]);
    });
  });
});
