var fs = require('fs');

async function readdir(path) {
  return new Promise((res, rej) => {
    fs.readdir(path, (err, data) => {
      if (err) rej(err);
      else res(data);
    });
  });
}

async function readFile(...args) {
  return new Promise((res, rej) => {
    fs.readFile(...args, (err, data) => {
      if (err) rej(err);
      else res(data);
    });
  });
}

async function writeFile(...args) {
  return new Promise((res, rej) => {
    fs.writeFile(...args, (err, data) => {
      if (err) rej(err);
      else res(data);
    });
  });
}

module.exports = {
  readdir, readFile, writeFile
};
