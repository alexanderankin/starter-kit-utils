var { expect } = require('chai');
var tmp = require('tmp-promise');

var path = require('path');
var os = require('os');

var { generateCopyList, generateCopyListRecursive } = require('../lib/renderFolder');
var { renderFolder, util } = require('..');
var { copyFile, exists, readFile, unlink, writeFile } = util;

var fixture = path.join.bind(path, __dirname, 'fixtures');

describe('renderFolder', () => {
  describe.skip('errors'); // is this project rly mature enough for this test?

  describe('does it render folders', () => {
    var dir;

    before(async () => {
      dir = await tmp.dir({ unsafeCleanup: true });
      // await renderFolder
    });

    after(async () => await dir.cleanup());

    it.skip('should run');
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
