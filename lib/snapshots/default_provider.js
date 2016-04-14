'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _storage = require('../storage');

var _storage2 = _interopRequireDefault(_storage);

var _err = require('../err');

var _err2 = _interopRequireDefault(_err);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// todo 使用非关系型数据库存储
var db = _storage2.default[_config2.default.get('snapshot').db];
if (!db) throw { code: _err2.default.configFailed, msg: '快照数据库未正确配置，可以在config/snapshot.js中指定' };

var _class = function () {
  function _class() {
    _classCallCheck(this, _class);

    this.option = _config2.default.get('snapshot').option;
  }

  _createClass(_class, [{
    key: 'canCreateOrUpdateSnapshot',
    value: function canCreateOrUpdateSnapshot(aggregateRoot) {}
  }, {
    key: 'createOrUpdateSnapshot',
    value: function createOrUpdateSnapshot(aggregateRoot) {}
  }, {
    key: 'commit',
    value: function commit() {}
  }, {
    key: 'rollback',
    value: function rollback() {}
  }]);

  return _class;
}();

exports.default = _class;