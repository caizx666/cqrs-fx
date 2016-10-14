import {
  safeRequire,
  isArray,
  isString,
  isFunction,
  isObject,
  getFiles,
  sep,
  normalize
} from './utils';

export const fxData = {
  alias: {},
  export: {}
};

export function alias(type, paths) {
  if (!type) {
    return fxData.alias;
  }
  // 支持对象和回调动态创建，支持动态对象
  if (isObject(paths) || isFunction(paths)) {
    fxData.alias[type] = paths;
    return;
  }
  //regist alias
  if (!isArray(paths)) {
    paths = [paths];
  }
  paths.forEach(path => {
    let files = getFiles(path);
    files.forEach(file => {
      if (file.slice(-3) !== '.js' || file[0] === '_') {
        return;
      }
      let name = file.slice(0, -3).replace(/\\/g, '/'); //replace \\ to / on windows
      name = type + '/' + name;
      fxData.alias[name] = `${path}${sep}${file}`;
    });
  });
}

let _loadRequire = (name, filepath) => {
  let obj = _safeRequire(filepath);
  if (isFunction(obj)) {
    obj.prototype.__type = name;
    obj.prototype.__filename = filepath;
  }
  if (obj) {
    fxData.export[name] = obj;
  }
  return obj;
};

export function _require(name, flag) {
  if (!isString(name)) {
    return name;
  }
  // adapter or middle by register
  let Cls = fxData.export[name];
  if (Cls) {
    return Cls;
  }

  let filepath = fxData.alias[name];
  // 支持对象
  if (isObject(filepath)) {
    fxData.export[name] = filepath;
    return filepath;
  }
  // 支持回调函数创建
  if (isFunction(filepath)) {
    let obj = filepath();
    if (obj) {
      fxData.export[name] = obj;
    }
    return obj;
  }
  // 默认从文件加载
  if (isString(filepath)) {
    return _loadRequire(name, normalize(filepath));
  }
  // only check in alias
  if (flag) {
    return null;
  }
  filepath = require.resolve(name);
  return _loadRequire(name, filepath);
}
