import path from 'path';
import fs from 'fs';
import config from './config';
export uuid from 'uuid';
import log4js from 'log4js';

log4js.configure({
  "appenders": [
    {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: "\x1B[90m[%d]\x1B[39m \x1B[36m[CQRS]\x1B[39m %[%m%]"
      }
      // }, {
      //   "type": "dateFile",
      //   "filename":   path.dirname(__dirname) + path.sep + 'runtime' + path.sep + 'logs' + path.sep +'server.txt',
      //   "pattern": "_yyyy-MM-dd",
      //   "alwaysIncludePattern": false
    }
  ]
});

export const logger = log4js.getLogger();

export const isFile = file => {
  return fs.statSync(file).isFile();
};
export const isDir = file => {
  return fs.statSync(file).isDirectory();
};
export const log = (...msgs) => {
  const cfg = config.get('log');
  if (cfg.enable) {
    const logging = cfg.logging;
    if (typeof logging == 'function') {
      return logging(...msgs);
    }
    logger.debug(...msgs);
  }
};
export const warn = (...msgs) => {
  logger.warn(...msgs);
};
export const error = (...msgs) => {
  logger.error(...msgs);
};
export const sep = path.sep;
export const normalize = path.normalize;
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
    if (fs.statSync(path.join(file, fi)).isDirectory())
      dirs.push(fi);
    }
  return dirs;
}

export function getFiles(file) {
  let dirs = [];
  if (fs.existsSync(file)) {
    let files = fs.readdirSync(file);
    for (var fi of files) {
      if (fs.statSync(path.join(file, fi)).isFile())
        dirs.push(fi);
      }
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
  return (value instanceof Array || (!(value instanceof Object) && (Object.prototype.toString.call((value)) == '[object Array]') || typeof value.length == 'number' && typeof value.splice != 'undefined' && typeof value.propertyIsEnumerable != 'undefined' && !value.propertyIsEnumerable('splice')));
}

export function isFunction(func) {
  return typeof func === 'function';
}

export function isString(txt) {
  return typeof txt === 'string';
}

export function isNumber(txt) {
  return typeof txt === 'number';
}

export function isObject(txt) {
  return typeof txt === 'object';
}

let parseValue = function(exprArray, name, value, opt) {
  if (value === null)
    return;
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

export function merge(...args) {
  let obj = {};
  for (let item of args) {
    if (!item)
      continue;
    for (let p of item) {
      if (item.hasOwnProperty(p) && item[p]) {
        obj[p] = (obj[p] || []).concat(item[p]);
      }
    }
  }
  return obj;
}

export function getClassName(Type) {
  assert(Type);
  if (Type.name != '_class') {
    return Type.name;
  }
  const filename = Type.prototype.__filename;
  if (filename) {
    const sp = filename.split(path.sep);
    const name = sp[sp.length - 1];
    const extIndex = name.lastIndexOf('.');
    return name.substr(0, extIndex);
  }
  return Type.name;
}
