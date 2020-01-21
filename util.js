var fs = require('fs');

async function copyFile(...args) {
  return new Promise((res, rej) => {
    fs.copyFile(...args, (err, data) => {
      if (err) rej(err);
      else res(data);
    });
  });
}

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

async function unlink(...args) {
  return new Promise((res, rej) => {
    fs.unlink(...args, (err, data) => {
      if (err) rej(err);
      else res(data);
    });
  });
}

async function exists(file) {
  return new Promise((res) => {
    fs.access(file, fs.constants.F_OK, err => {
      res(!err);
    });
  });
}

module.exports = {
  copyFile, readdir, readFile, writeFile, unlink, exists
};
