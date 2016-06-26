'use strict';

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault2(_promise);

var _defineProperty = require("babel-runtime/core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault2(_defineProperty);

function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _utils = require('../utils');

var _mysql = require('../storage/mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var _class = function () {
  function _class() {
    _classCallCheck(this, _class);

    this._tableName = _config2.default.get('snapshot').table;
    this._actionList = [];
    this.db = _mysql2.default.pool;
  }

  _createClass(_class, [{
    key: 'count',
    value: function count(spec) {
      return new _promise2.default(function (resolve, reject) {
        this.db.query('select count(*) from ?? where ??', [this._tableName, (0, _utils.expr)(spec)], function (err, result) {
          if (err) reject(err);
          resolve(result[0][0]);
        });
      });
    }
  }, {
    key: 'first',
    value: function first(spec) {
      return new _promise2.default(function (resolve, reject) {
        this.db.query('select id,aggregate_root_type,aggregate_root_id,data,version,branch,timestamp from ?? where ?? order by version asc ', [this._tableName, (0, _utils.expr)(spec)], function (err) {
          if (err) reject(err);

          for (var _len = arguments.length, result = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            result[_key - 1] = arguments[_key];
          }

          resolve(result);
        });
      });
    }
  }, {
    key: 'inert',
    value: function inert(dto) {
      this._actionList.push({
        action: 0,
        data: dto
      });
    }
  }, {
    key: 'update',
    value: function update(dto, spec) {
      this._actionList.push({
        action: 1,
        data: dto,
        spec: spec
      });
    }
  }, {
    key: 'commit',
    value: function commit() {
      var list = this._actionList.slice(0);
      var count = list.length;
      var checkCommit = function checkCommit(connection, resolve, reject) {
        if (err) {
          return connection.rollback(function () {
            connection.release();
            reject(err);
          });
        }
        count--;
        if (count == 0) {
          connection.commit(function (err) {
            connection.release();
            if (err) reject(err);
            log('保存快照完成');

            var s = 0;
            for (var _i = 0, l = this._actionList.length; _i < l; _i++) {
              if (this._actionList[_i] == list[0]) {
                s = _i;
                break;
              }
            }
            this._actionList.splice(i, list.length);
            resolve();
          });
        }
      };
      return new _promise2.default(function (resolve, reject) {
        if (count <= 0) {
          resolve();
          return;
        }
        this.db.getConnection(function (err, connection) {
          connection.beginTransaction(function (err) {
            if (err) reject(err);
            list.forEach(function (item) {
              if (item.action == 1) {
                connection.query('update ?? data,version,branch,timestamp values (?,?,?,?) where ??', [this._tableName, spec.data, spec.version, spec.branch, spec.timestamp, (0, _utils.expr)(item.spec)], function (err) {
                  checkCommit(connection, resolve, reject);
                });
              }
              if (item.action == 0) {
                connection.query('inert into ?? (id,aggregate_root_type,aggregate_root_id,data,version,branch,timestamp) values (?,?,?,?,?,?,?)', [this._tableName, spec.id, spec.aggregateRootType, spec.aggregateRootID, spec.data, spec.version, spec.branch, spec.timestamp], function (err) {
                  checkCommit(connection, resolve, reject);
                });
              }
            });
          });
        });
      });
    }
  }, {
    key: 'rollback',
    value: function rollback() {
      this._actionList.clear();
    }
  }]);

  return _class;
}();

exports.default = _class;