# Starter Kit Utils

Simpler API and only one dependency for common create- style packages and
starter kits' prompt q's.

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

### `getAuthorInfo`

This function will try to find remotes in the local git configuration and user's name and email from the global configuration. This populates the author and repository fields.

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
