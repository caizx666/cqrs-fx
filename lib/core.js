'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alias = alias;
exports.getType = getType;
var fxData = exports.fxData = {
  alias: {},
  export: {}
};

function alias(type, paths) {
  if (!type) {
    return fxData.alias;
  }
  //regist alias
  if (!isArray(paths)) {
    paths = [paths];
  }
  paths.forEach(function (path) {
    var files = getFiles(path);
    files.forEach(function (file) {
      if (file.slice(-3) !== '.js' || file[0] === '_') {
        return;
      }
      var name = file.slice(0, -3).replace(/\\/g, '/'); //replace \\ to / on windows
      name = type + '/' + name;
      fxData.alias[name] = '' + path + sep + file;
    });
  });
};

var _interopSafeRequire = function _interopSafeRequire(file) {
  var obj = require(file);
  if (obj && obj.__esModule && obj.default) {
    return obj.default;
  }
  return obj;
};

var _safeRequire = function _safeRequire(file) {
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
};

var _loadRequire = function _loadRequire(name, filepath) {
  var obj = _safeRequire(filepath);
  if (isFunction(obj)) {
    obj.prototype.__type = name;
    obj.prototype.__filename = filepath;
  }
  if (obj) {
    fxData.export[name] = obj;
  }
  return obj;
};

function getType(name, flag) {
  if (!isString(name)) {
    return name;
  }
  // adapter or middle by register
  var Cls = fxData.export[name];
  if (Cls) {
    return Cls;
  }

  var filepath = fxData.alias[name];
  if (filepath) {
    return _loadRequire(name, path.normalize(filepath));
  }
  // only check in alias
  if (flag) {
    return null;
  }
  filepath = require.resolve(name);
  return _loadRequire(name, filepath);
};