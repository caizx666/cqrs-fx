'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _repository = require('../repository');

var _repository2 = _interopRequireDefault(_repository);

var _aggregate = require('../aggregate');

var _aggregate2 = _interopRequireDefault(_aggregate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function () {
  function _class() {
    (0, _classCallCheck3.default)(this, _class);

    this.repository = _repository2.default;
    this.aggregate = _aggregate2.default;
  }

  (0, _createClass3.default)(_class, [{
    key: 'run',
    value: function run(command) {}
  }]);
  return _class;
}();

exports.default = _class;
//# sourceMappingURL=handler.js.map