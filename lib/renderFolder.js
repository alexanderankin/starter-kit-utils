var path = require('path');

var {
  copyFile, readdir, readFile, writeFile, stat
} = require('../util');

/**
 * Generate Copy List
 * 
 * This function traverses a folder and makes a list all files to render
 * 
 * For example, if a folder structure were like
 * 
 * .
 * ├── a
 * ├── b
 * │   ├── c
 * │   ├── d
 * │   ├── e
 * 
 * This function would return:
 * 
 * [
 *   { from: '/path/to/templateDir/a', relativeTo: 'a' },
 *   { from: '/path/to/templateDir/b/c', relativeTo: 'b/c' },
 *   { from: '/path/to/templateDir/b/d', relativeTo: 'b/d' },
 *   { from: '/path/to/templateDir/b/e', relativeTo: 'b/e' }
 * ]
 * 
 * @param templateDir string directory to traverse
 * @return copyList array[object] list of { from, relativeTo }
 */
async function generateCopyList(templateDir) {
  return await generateCopyListRecursive(templateDir, [], []);
}

async function generateCopyListRecursive(templateDir, stack, list) {
  var names = await readdir(templateDir);
  var contents = names.map(n => path.join(templateDir, n));
  var stats = await Promise.all(contents.map(c => stat(c)));

  for (var i = 0; i < contents.length; i++) {
    var name = names[i];
    var file = contents[i];
    var info = stats[i];

    // if (info.isSymbolicLink()) continue;  // the ppls arent rdy 4 tht
    if (info.isDirectory()) {
      stack.push(name);
      await generateCopyListRecursive(path.join(templateDir, name), stack, list);
      stack.pop();
    } else if (info.isFile()) {
      list.push({
        from: file,
        relativeTo: stack.concat(name).join(path.sep)
      });
    }
  }

  return list;
}

async function renderFolder(templateDir, destDir, locals) {
  // body...
}

module.exports = {
  generateCopyList, generateCopyListRecursive, renderFolder
};
