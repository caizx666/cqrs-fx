'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.require = exports.fxData = undefined;
exports.alias = alias;

var _utils = require('./utils');

var fxData = exports.fxData = {
  alias: {},
  export: {}
};

function alias(type, paths) {
  if (!type) {
    return fxData.alias;
  }
  // 支持对象和回调动态创建，支持动态对象
  if ((0, _utils.isObject)(paths) || (0, _utils.isFunction)(paths)) {
    fxData.alias[type] = paths;
    return;
  }
  //regist alias
  if (!(0, _utils.isArray)(paths)) {
    paths = [paths];
  }
  paths.forEach(function (path) {
    var files = (0, _utils.getFiles)(path);
    files.forEach(function (file) {
      if (file.slice(-3) !== '.js' || file[0] === '_') {
        return;
      }
      var name = file.slice(0, -3).replace(/\\/g, '/'); //replace \\ to / on windows
      name = type + '/' + name;
      fxData.alias[name] = '' + path + _utils.sep + file;
    });
  });
}

var _loadRequire = function _loadRequire(name, filepath) {
  var obj = _safeRequire(filepath);
  if ((0, _utils.isFunction)(obj)) {
    obj.prototype.__type = name;
    obj.prototype.__filename = filepath;
  }
  if (obj) {
    fxData.export[name] = obj;
  }
  return obj;
};

function _require(name, flag) {
  if (!(0, _utils.isString)(name)) {
    return name;
  }
  // adapter or middle by register
  var Cls = fxData.export[name];
  if (Cls) {
    return Cls;
  }

  var filepath = fxData.alias[name];
  // 支持对象
  if ((0, _utils.isObject)(filepath)) {
    fxData.export[name] = filepath;
    return filepath;
  }
  // 支持回调函数创建
  if ((0, _utils.isFunction)(filepath)) {
    var obj = filepath();
    if (obj) {
      fxData.export[name] = obj;
    }
    return obj;
  }
  // 默认从文件加载
  if ((0, _utils.isString)(filepath)) {
    return _loadRequire(name, path.normalize(filepath));
  }
  // only check in alias
  if (flag) {
    return null;
  }
  filepath = _require.resolve(name);
  return _loadRequire(name, filepath);
}
exports.require = _require;