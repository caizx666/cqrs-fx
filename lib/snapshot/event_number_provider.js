'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _err = require('../err');

var _err2 = _interopRequireDefault(_err);

var _domain_event_storage = require('../event/domain_event_storage');

var _domain_event_storage2 = _interopRequireDefault(_domain_event_storage);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function () {
  function _class() {
    (0, _classCallCheck3.default)(this, _class);

    var snapshotConfig = _config2.default.get('snapshot');
    var snapshotStorage = require('./' + snapshotConfig.storage + '_storage');
    if (!snapshotStorage) throw {
      code: _err2.default.configFailed,
      msg: '快照数据存储服务未正确配置，可以在config/snapshot.js中指定'
    };

    this.option = snapshotConfig.option;
    this.numOfEvents = snapshotConfig.numberOfEvents;

    this.snapshotStorage = snapshotStorage;
    this.eventStorage = _domain_event_storage2.default;

    this._snapshotMapping = new _map2.default();
  }

  (0, _createClass3.default)(_class, [{
    key: 'hasSnapshot',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(name, id) {
        var key, snapshotRecordCnt;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(!name || !id)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return', false);

              case 2:
                key = name + '/' + id;

                if (!(this._snapshotMapping.keys().indexOf(key) > -1)) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt('return', true);

              case 5:
                _context.next = 7;
                return this.snapshotStorage.count({
                  aggregate_root_type: name,
                  aggregate_root_id: id
                });

              case 7:
                snapshotRecordCnt = _context.sent;

                if (!(snapshotRecordCnt > 0)) {
                  _context.next = 12;
                  break;
                }

                return _context.abrupt('return', true);

              case 12:
                return _context.abrupt('return', false);

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function hasSnapshot(_x, _x2) {
        return ref.apply(this, arguments);
      }

      return hasSnapshot;
    }()
  }, {
    key: 'getSnapshot',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(name, id) {
        var key, dataObj, snapshot;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(!name || !id)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt('return', null);

              case 2:
                key = name + '/' + id;

                if (!(this._snapshotMapping.keys().indexOf(key) > -1)) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt('return', this._snapshotMapping[key]);

              case 5:
                _context2.next = 7;
                return this.snapshotStorage.first({
                  aggregate_root_type: name,
                  aggregate_root_id: id
                });

              case 7:
                dataObj = _context2.sent;

                if (!(dataObj == null)) {
                  _context2.next = 10;
                  break;
                }

                return _context2.abrupt('return', null);

              case 10:
                snapshot = Object.assgin(JSON.parse(dataObj.data), {
                  id: dataObj.aggregateRootID,
                  branch: dataObj.branch,
                  version: dataObj.version,
                  timestamp: dataObj.timestamp
                });

                this._snapshotMapping.set(key, snapshot);
                return _context2.abrupt('return', snapshot);

              case 13:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getSnapshot(_x3, _x4) {
        return ref.apply(this, arguments);
      }

      return getSnapshot;
    }()
  }, {
    key: 'canCreateOrUpdateSnapshot',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(aggregateRoot) {
        var snapshot, aggregateRootType, aggregateRootID, version, eventCnt;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(!aggregateRoot || !aggregateRoot.prototype.__type || !aggregateRoot.id)) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt('return', false);

              case 2:
                _context3.next = 4;
                return this.hasSnapshot(aggregateRoot.prototype.__type, aggregateRoot.id);

              case 4:
                if (!_context3.sent) {
                  _context3.next = 11;
                  break;
                }

                _context3.next = 7;
                return this.getSnapshot(aggregateRoot.prototype.__type, aggregateRoot.id);

              case 7:
                snapshot = _context3.sent;
                return _context3.abrupt('return', snapshot.version + this.numOfEvents <= aggregateRoot.version);

              case 11:
                aggregateRootType = aggregateRoot.prototype.__type;
                aggregateRootID = aggregateRoot.id;
                version = aggregateRoot.version;
                _context3.next = 16;
                return this.eventStorage.count({
                  aggregate_root_type: aggregateRootType,
                  aggregate_root_id: aggregateRootID,
                  version: ['<=', version]
                });

              case 16:
                eventCnt = _context3.sent;
                return _context3.abrupt('return', eventCnt >= this.numOfEvents);

              case 18:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function canCreateOrUpdateSnapshot(_x5) {
        return ref.apply(this, arguments);
      }

      return canCreateOrUpdateSnapshot;
    }()
  }, {
    key: 'createOrUpdateSnapshot',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(aggregateRoot) {
        var snapshot, dataObj, key, aggregateRootType, aggregateRootID;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(!aggregateRoot || !aggregateRoot.prototype.__type || !aggregateRoot.id)) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt('return');

              case 2:
                snapshot = aggregateRoot.createSnapshot();
                dataObj = {
                  aggregateRootID: aggregateRoot.id,
                  aggregateRootType: aggregateRoot.prototype.__name,
                  data: (0, _stringify2.default)(snapshot),
                  version: aggregateRoot.version,
                  branch: aggregateRoot.branch,
                  timestamp: aggregateRoot.timestamp
                };
                key = aggregateRoot.prototype.__type + '/' + aggregateRoot.id;
                _context4.next = 7;
                return this.hasSnapshot(aggregateRoot.prototype.__type, aggregateRoot.id);

              case 7:
                if (!_context4.sent) {
                  _context4.next = 15;
                  break;
                }

                aggregateRootType = aggregateRoot.prototype.__type;
                aggregateRootID = aggregateRoot.id;
                _context4.next = 12;
                return this.snapshotStorage.update(dataObj, {
                  aggregate_root_type: aggregateRootType,
                  aggregate_root_id: aggregateRootID
                });

              case 12:
                this._snapshotMapping.set(key, snapshot);
                _context4.next = 19;
                break;

              case 15:
                dataObj.id = _nodeUuid2.default.v1();
                _context4.next = 18;
                return this.snapshotStorage.insert(dataObj);

              case 18:
                this._snapshotMapping.set(key, snapshot);

              case 19:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function createOrUpdateSnapshot(_x6) {
        return ref.apply(this, arguments);
      }

      return createOrUpdateSnapshot;
    }()
  }, {
    key: 'commit',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.snapshotStorage.commit();

              case 2:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function commit() {
        return ref.apply(this, arguments);
      }

      return commit;
    }()
  }, {
    key: 'rollback',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.snapshotStorage.rollback();

              case 2:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function rollback() {
        return ref.apply(this, arguments);
      }

      return rollback;
    }()
  }]);
  return _class;
}();

exports.default = _class;