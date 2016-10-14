'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

exports.default = new (function () {
  function _class() {
    _classCallCheck(this, _class);

    var mysqlConfig = _config2.default.get('mysql');
    this.pool = _mysql2.default.createPool(mysqlConfig);
  }

  return _class;
}())();