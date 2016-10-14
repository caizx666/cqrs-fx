'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _event_sourced_repository = require('./event_sourced_repository');

var _event_sourced_repository2 = _interopRequireDefault(_event_sourced_repository);

var _snapshot = require('../snapshot');

var _aggregate = require('../aggregate');

var _aggregate2 = _interopRequireDefault(_aggregate);

var _event = require('../event');

var _utils = require('../utils');

var _bus = require('../bus');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class() {
    _classCallCheck(this, _class);

    this._saveHash = [];
  }

  _createClass(_class, [{
    key: 'createAggregate',
    value: function createAggregate(name, id, props) {
      var CLS = _aggregate2.default.get(name);
      if (!CLS || !(0, _utils.isFunction)(CLS)) return null;
      return new (Function.prototype.bind.apply(CLS, [null].concat([id], _toConsumableArray(props))))();
    }
  }, {
    key: 'get',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(name, id) {
        for (var _len = arguments.length, props = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          props[_key - 2] = arguments[_key];
        }

        var aggregateRoot, snapshot, eventsAfterSnapshot, evnts;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(!name || !id || !(0, _utils.isString)(name) || !(0, _utils.isString)(id))) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return', null);

              case 2:
                aggregateRoot = this.createAggregate(name, id, props);

                if (aggregateRoot) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt('return', null);

              case 5:
                _context.t0 = _snapshot.provider;

                if (!_context.t0) {
                  _context.next = 10;
                  break;
                }

                _context.next = 9;
                return _snapshot.provider.hasSnapshot(name, id);

              case 9:
                _context.t0 = _context.sent;

              case 10:
                if (!_context.t0) {
                  _context.next = 21;
                  break;
                }

                _context.next = 13;
                return _snapshot.provider.getSnapshot(name, id);

              case 13:
                snapshot = _context.sent;

                aggregateRoot.buildFromSnapshot(snapshot);
                _context.next = 17;
                return _event.storage.loadEvents(name, id, snapshot.Version);

              case 17:
                eventsAfterSnapshot = _context.sent;

                if (eventsAfterSnapshot && eventsAfterSnapshot.length > 0) aggregateRoot.buildFromHistory(eventsAfterSnapshot);
                _context.next = 30;
                break;

              case 21:
                aggregateRoot.id = id;
                _context.next = 24;
                return _event.storage.loadEvents(name, id);

              case 24:
                evnts = _context.sent;

                if (!(evnts != null && evnts.Count() > 0)) {
                  _context.next = 29;
                  break;
                }

                aggregateRoot.buildFromHistory(evnts);
                _context.next = 30;
                break;

              case 29:
                throw {
                  code: err.aggregateNotExists,
                  msg: '领域对象(id=' + id + ')未能在数据库中找到.'
                };

              case 30:
                return _context.abrupt('return', aggregateRoot);

              case 31:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function get(_x, _x2, _x3) {
        return ref.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: 'save',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(aggregate) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(this._saveHash.indexOf(aggregate) > -1)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt('return');

              case 2:
                this._saveHash.push(aggregate);

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function save(_x4) {
        return ref.apply(this, arguments);
      }

      return save;
    }()
  }, {
    key: 'commit',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, aggregateRoot, events, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, evt;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context3.prev = 3;
                _iterator = this._saveHash[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context3.next = 45;
                  break;
                }

                aggregateRoot = _step.value;

                if (!(_snapshot.provider && _snapshot.provider.option == 'immediate')) {
                  _context3.next = 13;
                  break;
                }

                _context3.next = 10;
                return _snapshot.provider.canCreateOrUpdateSnapshot(aggregateRoot);

              case 10:
                if (!_context3.sent) {
                  _context3.next = 13;
                  break;
                }

                _context3.next = 13;
                return _snapshot.provider.createOrUpdateSnapshot(aggregateRoot);

              case 13:
                events = aggregateRoot.uncommittedEvents;
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context3.prev = 17;
                _iterator2 = events[Symbol.iterator]();

              case 19:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context3.next = 28;
                  break;
                }

                evt = _step2.value;
                _context3.next = 23;
                return _event.storage.saveEvent(evt);

              case 23:
                _context3.next = 25;
                return _bus.eventbus.publish(evt);

              case 25:
                _iteratorNormalCompletion2 = true;
                _context3.next = 19;
                break;

              case 28:
                _context3.next = 34;
                break;

              case 30:
                _context3.prev = 30;
                _context3.t0 = _context3['catch'](17);
                _didIteratorError2 = true;
                _iteratorError2 = _context3.t0;

              case 34:
                _context3.prev = 34;
                _context3.prev = 35;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 37:
                _context3.prev = 37;

                if (!_didIteratorError2) {
                  _context3.next = 40;
                  break;
                }

                throw _iteratorError2;

              case 40:
                return _context3.finish(37);

              case 41:
                return _context3.finish(34);

              case 42:
                _iteratorNormalCompletion = true;
                _context3.next = 5;
                break;

              case 45:
                _context3.next = 51;
                break;

              case 47:
                _context3.prev = 47;
                _context3.t1 = _context3['catch'](3);
                _didIteratorError = true;
                _iteratorError = _context3.t1;

              case 51:
                _context3.prev = 51;
                _context3.prev = 52;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 54:
                _context3.prev = 54;

                if (!_didIteratorError) {
                  _context3.next = 57;
                  break;
                }

                throw _iteratorError;

              case 57:
                return _context3.finish(54);

              case 58:
                return _context3.finish(51);

              case 59:
                _context3.next = 61;
                return _event.storage.commit();

              case 61:
                _context3.next = 63;
                return _bus.eventbus.commit();

              case 63:
                if (!(_snapshot.provider && _snapshot.provider.option == 'immediate')) {
                  _context3.next = 66;
                  break;
                }

                _context3.next = 66;
                return _snapshot.provider.commit();

              case 66:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 47, 51, 59], [17, 30, 34, 42], [35,, 37, 41], [52,, 54, 58]]);
      }));

      function commit() {
        return ref.apply(this, arguments);
      }

      return commit;
    }()
  }, {
    key: 'rollback',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _event.storage.Rollback();

              case 2:
                if (!(_snapshot.provider && _snapshot.provider.option == 'immediate')) {
                  _context4.next = 5;
                  break;
                }

                _context4.next = 5;
                return _snapshot.provider.Rollback();

              case 5:
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