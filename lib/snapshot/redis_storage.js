'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _utils = require('../utils');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class() {
    _classCallCheck(this, _class);

    var redisConfig = _config2.default.get('redis');
    this._password = redisConfig.password;
    this._hkey = 'cqrs_snapshot';
    this._client = _redis2.default.createClient(redisConfig);
    this._client.on("error", function (err) {
      (0, _utils.log)("Error " + err);
    });
  }

  _createClass(_class, [{
    key: 'count',
    value: function count(spec) {
      return new Promise(function (resolve, reject) {
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