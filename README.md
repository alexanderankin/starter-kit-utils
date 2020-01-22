# Starter Kit Utils

Simpler API and only one dependency for common create- style packages and
starter kits' prompt q's.

In the future, it may also provide some utility functions regarding
rendering a folder structure full of templates. Maybe even a CLI for testing
that stuff.

## Documentation

### `checkPath`

This function checks if something is on the path, like which. It takes three
arguments, `name`, a string, the name of the thing to look for, `envPath`, a
string, variable to use instead of `process.env`, `insensitive`, a boolean,
should the path check be insensitive.

If the third argument, insensitive is not given, it is set to whether we are
on windows.

Example:

```
var { checkPath } = require('starter-kit-utils');
checkPath('node').then(console.log.bind(console)); // '/usr/local/bin/node'
```

### `checkManagers`

This function will check if any of the files in the directories in the environment PATH variable insensitively match npm or yarn, or their Windows variants, `npm.exe` or `yarn.exe`.

It takes no arguments, and returns an object with two properties: `{ yarn: Boolean, npm: Boolean }`.

Example:

```
var { checkManagers } = require('starter-kit-utils');
checkManagers().then(console.log.bind(console));
// { npm: '/usr/local/bin/npm', yarn: '/home/toor/.yarn/bin/yarn' }
```

### `getAuthorInfo`

This function will try to find remotes in the local git configuration and user's name and email from the global configuration. This populates the author and repository fields.

Example:

```
var { getAuthorInfo } = require('starter-kit-utils');
getAuthorInfo().then(console.log.bind(console));
// { author: 'David Ankin <daveankin@gmail.com>' }
```

### `updateJSON`

This is the equivalent of doing something like `Object.assign({}, { new: data });` but on a physical file. This function takes first argument the file path, and the rest of the arguments are passed to `Object#assign`.

Example:

```
$ echo '{"a":5}' > file.json
$ node
> var { updateJSON } = require('starter-kit-utils');
> JSON.parse(fs.readFileSync('file.json', 'utf8'));
// { a: 5 }
> updateJSON('file.json', { a: undefined, b: 5, c: [ 5 ]})
.then(console.log.bind(console));
// { a: undefined, b: 5, c: [ 5 ] }
$ cat file.json
// {b:5,c:[5]}
```

### `addDeps`

This function will take the dependencies in the `getDeps` format and put them into a manifest, taking arguments, object, deps, dev or not

Example:

```
var { addDeps } = require('starter-kit-utils');
var a = {};
addDeps(a, [ { name: 'dotenv', version: '1.0.0' } ], true);
console.log(a); // { devDpendencies: { dotenv: '1.0.0' } }

a = {};
addDeps(a, [ { name: 'dotenv', version: '1.0.0' } ]);
console.log(a); // { dependencies: { dotenv: '1.0.0' } }
```

### `getDeps`

This function will actually query the npm repository via `pacote`, as follows:

```
async function getDeps(deps) {
  return await Promise.all(deps.map(async dep => {
    return {
      name: dep,
      version: (await pacote.manifest(dep)).version
    };
  }));
}
```

For example:
```
var { getDeps } = require('starter-kit-utils');
getDeps(['dotenv', 'express']).then(console.log.bind(console));
// [ { name: 'dotenv', version: '8.2.0' },
//   { name: 'express', version: '4.17.1' } ]
```

### Utility Functions

Example:

```
var { checkManagers } = require('starter-kit-utils');
checkManagers('node').then(console.log.bind(console));
// { npm: '/usr..., yarn: '/home...' }
```

The ones based on the `fs` module are to avoid the warnings when using `require('fs').promise`.

|Name|Args|Description|
|-|-|-|
|`copyFile`|`...args`|Returns a promise for the results of passing the `...args` to `fs.copyFile`|
|`readdir`|`string` path|Returns a promise for the results of `fs.readdir`|
|`readFile`|`...args`|Returns a promise for the results of passing the `...args` to `fs.readFile`|
|`writeFile`|`...args`|Returns a promise for the results of passing the `...args` to `fs.writeFile`|
|`unlink`|`...args`|Returns a promise for the results of passing the `...args` to `fs.unlink`|
|`exists`|`string` path|Returns a promise for true of `fs.access` does not error|
