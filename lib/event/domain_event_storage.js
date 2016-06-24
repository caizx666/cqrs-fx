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

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _err = require('../err');

var _err2 = _interopRequireDefault(_err);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function () {
  function _class() {
    (0, _classCallCheck3.default)(this, _class);

    var eventConfig = _config2.default.get('event');
    var eventStorage = require('./' + eventConfig.storage + '_storage');
    if (!eventStorage) throw {
      code: _err2.default.configFailed,
      msg: '事件存储服务未正确配置，可以在config/event.js中指定'
    };

    this.eventStorage = eventStorage;
  }

  (0, _createClass3.default)(_class, [{
    key: 'loadEvents',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(name, id, version) {
        var results, events;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                results = void 0;

                if (!version) {
                  _context.next = 5;
                  break;
                }

                _context.next = 4;
                return this.eventStorage.select({
                  event_type: name,
                  event_id: id,
                  version: ['<', version]
                });

              case 4:
                results = _context.sent;

              case 5:
                _context.next = 7;
                return this.eventStorage.select({
                  event_type: name,
                  event_id: id
                });

              case 7:
                results = _context.sent;
                events = [];

                results.forEach(function (s) {
                  events.push(Object.assgin(JSON.parse(s.data), {
                    eventType: s.name,
                    eventid: s.event_id,
                    sourceid: s.source_id,
                    branch: s.branch,
                    version: s.version,
                    timestamp: s.timestamp
                  }));
                });
                return _context.abrupt('return', events);

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loadEvents(_x, _x2, _x3) {
        return ref.apply(this, arguments);
      }

      return loadEvents;
    }()
  }, {
    key: 'saveEvent',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(event) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.eventStorage.inert({
                  id: uuid.v1(),
                  eventType: event.name,
                  eventid: event.id,
                  sourceid: event.sourceid,
                  data: (0, _stringify2.default)(),
                  timestamp: event.timestamp,
                  branch: event.branch,
                  version: event.version
                });

              case 2:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function saveEvent(_x4) {
        return ref.apply(this, arguments);
      }

      return saveEvent;
    }()
  }, {
    key: 'commit',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.eventStorage.commit();

              case 2:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function commit() {
        return ref.apply(this, arguments);
      }

      return commit;
    }()
  }, {
    key: 'rollback',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.eventStorage.rollback();

              case 2:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
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