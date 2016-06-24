'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _utils = require('../utils');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function () {
  function _class() {
    (0, _classCallCheck3.default)(this, _class);

    var redisConfig = _config2.default.get('redis');
    this._password = redisConfig.password;
    this._hkey = 'cqrs_snapshot';
    this._client = _redis2.default.createClient(redisConfig);
    this._client.on("error", function (err) {
      (0, _utils.log)("Error " + err);
    });
  }

  (0, _createClass3.default)(_class, [{
    key: 'count',
    value: function count(spec) {
      return new _promise2.default(function (resolve, reject) {
        this._client.hkeys(this._hkey, function (err, replies) {
          if (err) reject(err);
          resolve(replies.length);
        });
      });
    }

    // select first

  }, {
    key: 'first',
    value: function first(spec) {}
  }, {
    key: 'update',
    value: function update(dto, spec) {}
  }, {
    key: 'inert',
    value: function inert(dto) {}
  }, {
    key: 'commit',
    value: function commit() {
      var _commit = function functionName() {};
      if (this._password) {
        this._client.auth(this._password, function () {});
      } else {}
    }
  }, {
    key: 'rollback',
    value: function rollback() {}
  }]);
  return _class;
}();

exports.default = _class;