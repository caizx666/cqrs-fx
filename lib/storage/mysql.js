'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function _class() {
  (0, _classCallCheck3.default)(this, _class);

  this.pool = _mysql2.default.createPool(_config2.default.get('mysql'));
};

exports.default = _class;
;
//# sourceMappingURL=mysql.js.map