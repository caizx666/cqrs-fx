'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _mysqldb = require('./mysqldb');

var _mysqldb2 = _interopRequireDefault(_mysqldb);

var _redisdb = require('./redisdb');

var _redisdb2 = _interopRequireDefault(_redisdb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  mysql: _mysqldb2.default, redis: _redisdb2.default
};