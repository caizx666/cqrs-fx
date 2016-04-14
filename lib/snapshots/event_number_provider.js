'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _err = require('../err');

var _err2 = _interopRequireDefault(_err);

var _domain_event_storage = require('../event/domain_event_storage');

var _domain_event_storage2 = _interopRequireDefault(_domain_event_storage);

var _generator = require('../generator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
	function _class() {
		_classCallCheck(this, _class);

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

		this._snapshotMapping = new Map();
	}

	_createClass(_class, [{
		key: 'hasSnapshot',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(name, id) {
				var key, snapshotRecordCnt;
				return regeneratorRuntime.wrap(function _callee$(_context) {
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
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(name, id) {
				var key, dataObj, snapshot;
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
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
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(aggregateRoot) {
				var snapshot, aggregateRootType, aggregateRootID, version, eventCnt;
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
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
									version: ['<=', version] });

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
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(aggregateRoot) {
				var snapshot, dataObj, key, aggregateRootType, aggregateRootID;
				return regeneratorRuntime.wrap(function _callee4$(_context4) {
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
									data: JSON.stringify(snapshot),
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
								dataObj.id = _generator.idgenerator.get();
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
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
				return regeneratorRuntime.wrap(function _callee5$(_context5) {
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
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
				return regeneratorRuntime.wrap(function _callee6$(_context6) {
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