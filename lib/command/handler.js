'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _repository = require('../repository');

var _repository2 = _interopRequireDefault(_repository);

var _aggregate = require('../aggregate');

var _aggregate2 = _interopRequireDefault(_aggregate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class() {
    _classCallCheck(this, _class);

    this.repository = _repository2.default;
    this.aggregate = _aggregate2.default;
  }

  _createClass(_class, [{
    key: 'run',
    value: function run(command) {}
  }]);

  return _class;
}();

exports.default = _class;