'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bus = require('./bus');

var _bus2 = _interopRequireDefault(_bus);

var _handler = require('./command/handler');

var _handler2 = _interopRequireDefault(_handler);

var _handler3 = require('./event/handler');

var _handler4 = _interopRequireDefault(_handler3);

var _aggregate = require('./aggregate');

var _aggregate2 = _interopRequireDefault(_aggregate);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _core = require('./core');

var _register = require('./register');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  alias: _core.alias,
  require: _core._require,
  register: _register.register,
  registry: _register.registry,

  app: _app2.default,
  bus: _bus2.default,
  aggregate: _aggregate2.default,
  commandhandler: _handler2.default,
  eventhandler: _handler4.default
};