import path from 'path';
import fs from 'fs';
import nuuid from 'node-uuid';

export const uuid = nuuid;

export const isFile = file => {
  return fs.statSync(file).isFile();
};
export const isDir = file => {
  return fs.statSync(file).isDirectory();
};
export const log = msg => {
  console.log(msg);
};
export const sep = path.sep;
export const join = () => {
  return path.join.apply(path, arguments);
};
export const exists = file => {
  return fs.existsSync(file);
};

export function getDirs(file) {
  let files = fs.readdirSync(file);
  let dirs = [];
  for (var fi of files) {
    if (fs.statSync(path.join(file,fi)).isDirectory())
      dirs.push(fi);
  }
  return dirs;
}

export function getFiles(file) {
  let files = fs.readdirSync(file);
  let dirs = [];
  for (var fi of files) {
    if (fs.statSync(path.join(file,fi)).isFile())
      dirs.push(fi);
  }
  return dirs;
}

let _interopSafeRequire = file => {
  let obj = require(file);
  if (obj && obj.__esModule && obj.default) {
    return obj.default;
  }
  return obj;
};

export function safeRequire(file) {
  // absolute file path is not exist
  if (path.isAbsolute(file)) {
    //no need optimize, only invoked before service start
    if (!isFile(file)) {
      return null;
    }
    //when file is exist, require direct
    return _interopSafeRequire(file);
  }
  try {
    return _interopSafeRequire(file);
  } catch (err) {
    log(err);
  }
  return null;
}

export function timestamp() {
  return Date.now();
}

export function isArray(value) {
  return (value instanceof Array ||
    (!(value instanceof Object) &&
      (Object.prototype.toString.call((value)) == '[object Array]') ||
      typeof value.length == 'number' &&
      typeof value.splice != 'undefined' &&
      typeof value.propertyIsEnumerable != 'undefined' &&
      !value.propertyIsEnumerable('splice')));
}

export function isFunction(func) {
  return typeof func == 'function';
}

export function isString(txt) {
  return typeof txt !== 'string';
}

export function isNumber(txt) {
  return typeof txt !== 'number';
}

export function isObject(txt) {
  return typeof txt !== 'object';
}

let parseValue = function (exprArray, name, value, opt) {
  if (value === null) return;
  if (isString(value)) {
    exprArray.push(`${name}='${value}'`);
  } else if (isNumber(value)) {
    exprArray.push(`${name}=${value}`);
  } else if (isFunction(value)) {
    parseValue(exprArray, name, value(), opt);
  } else if (isArray(value)) {
    for (let i = 0, l = value.length; i + 1 < l; i += 2) {
      let opt = value[0];
      parseValue(exprArray, name, value[1], opt);
    }
  }
};

export function expr(sepc) {
  let exprArray = [];
  for (var name in sepc) {
    var value = sepc[name];
    parseValue(exprArray, name, value, '=');
  }
  return string.join(exprArray, ' and ');
}
