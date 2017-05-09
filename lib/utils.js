'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exists = exports.join = exports.normalize = exports.sep = exports.log = exports.isDir = exports.isFile = exports.uuid = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _arguments = arguments;
exports.getDirs = getDirs;
exports.getFiles = getFiles;
exports.safeRequire = safeRequire;
exports.timestamp = timestamp;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isString = isString;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.expr = expr;
exports.merge = merge;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uuid = exports.uuid = _uuid2.default;

var isFile = exports.isFile = function isFile(file) {
  return _fs2.default.statSync(file).isFile();
};
var isDir = exports.isDir = function isDir(file) {
  return _fs2.default.statSync(file).isDirectory();
};
var log = exports.log = function log(msg) {
  console.log(msg);
};
var sep = exports.sep = _path2.default.sep;
var normalize = exports.normalize = _path2.default.normalize;
var join = exports.join = function join() {
  return _path2.default.join.apply(_path2.default, _arguments);
};
var exists = exports.exists = function exists(file) {
  return _fs2.default.existsSync(file);
};

function getDirs(file) {
  var files = _fs2.default.readdirSync(file);
  var dirs = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(files), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var fi = _step.value;

      if (_fs2.default.statSync(_path2.default.join(file, fi)).isDirectory()) dirs.push(fi);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return dirs;
}

function getFiles(file) {
  var dirs = [];
  if (_fs2.default.existsSync(file)) {
    var files = _fs2.default.readdirSync(file);
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = (0, _getIterator3.default)(files), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var fi = _step2.value;

        if (_fs2.default.statSync(_path2.default.join(file, fi)).isFile()) dirs.push(fi);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }
  return dirs;
}

var _interopSafeRequire = function _interopSafeRequire(file) {
  var obj = require(file);
  if (obj && obj.__esModule && obj.default) {
    return obj.default;
  }
  return obj;
};

function safeRequire(file) {
  // absolute file path is not exist
  if (_path2.default.isAbsolute(file)) {
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

function timestamp() {
  return Date.now();
}

function isArray(value) {
  return value instanceof Array || !(value instanceof Object) && Object.prototype.toString.call(value) == '[object Array]' || typeof value.length == 'number' && typeof value.splice != 'undefined' && typeof value.propertyIsEnumerable != 'undefined' && !value.propertyIsEnumerable('splice');
}

function isFunction(func) {
  return typeof func === 'function';
}

function isString(txt) {
  return typeof txt === 'string';
}

function isNumber(txt) {
  return typeof txt === 'number';
}

function isObject(txt) {
  return (typeof txt === 'undefined' ? 'undefined' : (0, _typeof3.default)(txt)) === 'object';
}

var parseValue = function parseValue(exprArray, name, value, opt) {
  if (value === null) return;
  if (isString(value)) {
    exprArray.push(name + '=\'' + value + '\'');
  } else if (isNumber(value)) {
    exprArray.push(name + '=' + value);
  } else if (isFunction(value)) {
    parseValue(exprArray, name, value(), opt);
  } else if (isArray(value)) {
    for (var i = 0, l = value.length; i + 1 < l; i += 2) {
      var _opt = value[0];
      parseValue(exprArray, name, value[1], _opt);
    }
  }
};

function expr(sepc) {
  var exprArray = [];
  for (var name in sepc) {
    var value = sepc[name];
    parseValue(exprArray, name, value, '=');
  }
  return string.join(exprArray, ' and ');
}

function merge() {
  var obj = {};

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = (0, _getIterator3.default)(args), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var item = _step3.value;

      if (!item) continue;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = (0, _getIterator3.default)(item), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var p = _step4.value;

          if (item.hasOwnProperty(p) && item[p]) {
            obj[p] = (obj[p] || []).concat(item[p]);
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return obj;
}
//# sourceMappingURL=utils.js.map