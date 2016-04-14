'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bus = require('./bus');

var _bus2 = _interopRequireDefault(_bus);

var _repository = require('../repository');

var _repository2 = _interopRequireDefault(_repository);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class(type, dispatcher) {
    _classCallCheck(this, _class);

    this.messageQueue = [];
    this.type = type;
    this.dispatcher = dispatcher;
  }

  _createClass(_class, [{
    key: 'publish',
    value: function publish() {
      for (var _len = arguments.length, messages = Array(_len), _key = 0; _key < _len; _key++) {
        messages[_key] = arguments[_key];
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = messages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var msg = _step.value;

          this.messageQueue.push(msg);
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
    key: 'clear',
    value: function clear() {
      this.messageQueue.clear();
    }
  }, {
    key: 'commit',
    value: function commit() {
      var _this = this;

      this.messageQueue.forEach(function (msg) {
        _this.dispatcher.dispatch({ type: type, name: msg.name, data: msg.data });
      });
      _repository2.default.commit();
      this.messageQueue.clear();
    }
  }, {
    key: 'rollback',
    value: function rollback() {
      _repository2.default.rollback();
    }
  }]);

  return _class;
}();

exports.default = _class;