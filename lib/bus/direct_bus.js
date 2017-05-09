'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _repository = require('../repository');

var _repository2 = _interopRequireDefault(_repository);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function () {
  function _class(type, dispatcher) {
    (0, _classCallCheck3.default)(this, _class);

    this.messageQueue = [];
    this.type = type;
    this.dispatcher = dispatcher;
  }

  (0, _createClass3.default)(_class, [{
    key: 'publish',
    value: function publish() {
      for (var _len = arguments.length, messages = Array(_len), _key = 0; _key < _len; _key++) {
        messages[_key] = arguments[_key];
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(messages), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
//# sourceMappingURL=direct_bus.js.map