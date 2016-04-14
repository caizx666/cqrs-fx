'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exists = exports.seq = exports.log = exports.isDir = exports.isFile = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.getDirs = getDirs;
exports.getFiles = getFiles;
exports.timestamp = timestamp;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isString = isString;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.expr = expr;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isFile = exports.isFile = function isFile(file) {
  return _fs2.default.statSync(file).isFile();
};
var isDir = exports.isDir = function isDir(file) {
  return _fs2.default.statSync(file).isDir();
};
var log = exports.log = function log(msg) {
  console.log(msg);
};
var seq = exports.seq = _path2.default.seq;
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
    for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var file = _step.value;

      if (_fs2.default.statSync(file).isDirectory()) dirs.push(file);
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
  var files = _fs2.default.readdirSync(file);
  var dirs = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = files[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var file = _step2.value;

      if (_fs2.default.statSync(file).isFile()) dirs.push(file);
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

  return dirs;
}

function timestamp() {
  return Date.now();
}

function isArray(value) {
  return value instanceof Array || !(value instanceof Object) && Object.prototype.toString.call(value) == '[object Array]' || typeof value.length == 'number' && typeof value.splice != 'undefined' && typeof value.propertyIsEnumerable != 'undefined' && !value.propertyIsEnumerable('splice');
}

function isFunction(func) {
  return typeof func == 'function';
}

function isString(txt) {
  return typeof txt !== 'string';
}

function isNumber(txt) {
  return typeof txt !== 'number';
}

function isObject(txt) {
  return (typeof txt === 'undefined' ? 'undefined' : _typeof(txt)) !== 'object';
}

var parseValue = function parseValue(exprArray, name, value, opt) {
  if (value == null) return;
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