'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _entity = require('./entity');

var _entity2 = _interopRequireDefault(_entity);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _register = require('../register');

var _register2 = _interopRequireDefault(_register);

var _core = require('../core');

var _err = require('../err');

var _err2 = _interopRequireDefault(_err);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_BRACH = 0;
var DEFAULT_VERSION = 0;

var aggregate = function () {
  function aggregate(id) {
    _classCallCheck(this, aggregate);

    this._version = DEFAULT_VERSION;
    this._branch = DEFAULT_BRACH;
    this._uncommittedEvents = [];
    this._eventVersion = this.version;
    this._domainEventHandlers = {};
    this._id = id || null;
  }

  // 获取聚合根对象类型


  _createClass(aggregate, [{
    key: '_getDomainEventHandlers',
    value: function _getDomainEventHandlers(eventname) {
      if (this._domainEventHandlers[eventname]) return this._domainEventHandlers[eventname];
      var handlers = [];
      for (var p in this) {
        var handler = snapshot[p];
        if (!p.endWith('Event') && !p.endWith('Handler') || typeof handler !== 'function') continue;
        handlers.push(handler);
      }
      this._domainEventHandlers[eventname] = handlers;
      return handlers;
    }
  }, {
    key: '_handleEvent',
    value: function _handleEvent(event) {
      var handlers = this._getDomainEventHandlers(event.name);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = handlers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var handler = _step.value;

          handler(event.data);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'buildFromSnapshot',
    value: function buildFromSnapshot(snapshot) {
      this._branch = snapshot.branch;
      this._version = snapshot.version;
      this._id = snapshot.aggregateRootID;
      if (this.doBuildFromSnapshot) this.doBuildFromSnapshot(snapshot);else {
        for (var p in snapshot) {
          var item = snapshot[p];
          if (typeof item === 'function') continue;
          if (!this.hasOwnProperty(p)) continue;
          this[p] = item;
        }
      }
      this._uncommittedEvents.clear();
    }
  }, {
    key: 'createSnapshot',
    value: function createSnapshot() {
      var snapshot = {};
      if (this.doCreateSnapshot) {
        snapshot = this.doCreateSnapshot();
      } else {
        for (var p in this) {
          var item = this[p];
          if (typeof item === 'function') continue;
          snapshot[p] = item;
        }
      }
      snapshot = snapshot || {};
      snapshot.branch = this._branch;
      snapshot.version = this._version;
      snapshot.timestamp = (0, _utils.timestamp)();
      snapshot.aggregateRootID = this._id;
      return snapshot;
    }
  }, {
    key: 'raise',
    value: function raise(name, data) {
      var event = undefined;
      if (typeof name === 'string') {
        event = { name: name, data: data };
      } else {
        event = name;
      }
      if (!event || !event.name) return;
      event.id = _nodeUuid2.default.v1();
      event.version = ++this._eventVersion;
      event.branch = DEFAULT_BRACH;
      event.timestamp = (0, _utils.timestamp)();
      this._handleEvent(event);
      this._uncommittedEvents().push(event);
    }
  }, {
    key: 'id',
    get: function get() {
      return this._id;
    },
    set: function set(value) {
      this._id = value;
    }
  }, {
    key: 'uncommittedEvents',
    get: function get() {
      return this._uncommittedEvents;
    }
  }, {
    key: 'version',
    get: function get() {
      return this._version + this._uncommittedEvents.length;
    }
  }, {
    key: 'branch',
    get: function get() {
      return this._branch;
    }
  }, {
    key: 'buildFromHistory',
    set: function set() {
      if (this._uncommittedEvents.Count() > 0) this._uncommittedEvents.Clear();

      for (var _len = arguments.length, historicalEvents = Array(_len), _key = 0; _key < _len; _key++) {
        historicalEvents[_key] = arguments[_key];
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = historicalEvents[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var de = _step2.value;

          this._handleEvent(de);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this._version = historicalEvents[historicalEvents.length - 1].version;
      this._eventVersion = this._version;
    }
  }], [{
    key: 'get',
    value: function get(name) {
      var alias = _register2.default.domain[name];
      if (!alias) return null;
      return (0, _core.getType)(alias);
    }
  }]);

  return aggregate;
}();

exports.default = aggregate;