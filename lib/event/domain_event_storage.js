'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _err = require('../err');

var _err2 = _interopRequireDefault(_err);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
	function _class() {
		_classCallCheck(this, _class);

		var eventConfig = _config2.default.get('event');
		var eventStorage = require('./' + eventConfig.storage + '_storage');
		if (!eventStorage) throw {
			code: _err2.default.configFailed,
			msg: '事件存储服务未正确配置，可以在config/event.js中指定'
		};

		this.eventStorage = eventStorage;
	}

	_createClass(_class, [{
		key: 'loadEvents',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(name, id, version) {
				var results, events;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								results = undefined;

								if (!version) {
									_context.next = 5;
									break;
								}

								_context.next = 4;
								return this.eventStorage.select({
									event_type: name,
									event_id: id, version: ['<', version]
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
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(event) {
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.next = 2;
								return this.eventStorage.inert({
									id: uuid.v1(),
									eventType: event.name,
									eventid: event.id,
									sourceid: event.sourceid,
									data: JSON.stringify(),
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
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
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
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
				return regeneratorRuntime.wrap(function _callee4$(_context4) {
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