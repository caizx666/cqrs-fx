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

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _utils = require('../utils');

var _mysql = require('../storage/mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function () {
  function _class() {
    (0, _classCallCheck3.default)(this, _class);

    this.db = _mysql2.default.pool;
    this._tableName = _config2.default.get('event').table;
    this._addList = [];
  }

  (0, _createClass3.default)(_class, [{
    key: 'count',
    value: function count(spec) {
      return new _promise2.default(function (resolve, reject) {
        this.db.query('select count(*) from ?? where ?? ', [this._tableName, (0, _utils.expr)(spec)], function (err, result) {
          if (err) reject(err);
          resolve(result[0][0]);
        });
      });
    }
  }, {
    key: 'select',
    value: function select(spec) {
      return new _promise2.default(function (resolve, reject) {
        this.db.query('select name,id,data,timestamp from ?? where ?? order by version asc ', [this._tableName, (0, _utils.expr)(spec)], function (err, rows, fields) {
          if (err) reject(err);
          resolve(rows, fields);
        });
      });
    }
  }, {
    key: 'inert',
    value: function inert(dto) {
      this._addList.push(dto);
    }
  }, {
    key: 'commit',
    value: function commit() {
      return new _promise2.default(function (resolve, reject) {
        this.db.getConnection(function (err, connection) {
          connection.beginTransaction(function (err) {
            if (err) reject(err);
            var count = this._addList.length;
            this._addList.forEach(function (spec) {
              connection.query('inert in to ?? (id, event_type,event_id,source_id,data,version,branch,timestamp) values (?,?,?,?,?,?,?)', [this._tableName, spec.id, spec.eventType, spec.eventid, spec.sourceid, spec.data, spec.version, spec.branch, spec.timestamp], function (err) {
                if (err) {
                  return connection.rollback(function () {
                    connection.release();
                    reject(err);
                  });
                }
                count--;
                if (count === 0) {
                  this._addList.clear();
                  connection.commit(function (err) {
                    connection.release();
                    if (err) reject(err);
                    log('保存领域事件完成');
                    resolve();
                  });
                }
              });
            });
          });
        });
      });
    }
  }, {
    key: 'rollback',
    value: function rollback() {
      this._addList.clear();
    }
  }]);
  return _class;
}();

exports.default = _class;
//# sourceMappingURL=mysql_storage.js.map