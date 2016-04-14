'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _handler = require('./command/handler');

var _handler2 = _interopRequireDefault(_handler);

var _handler3 = require('./event/handler');

var _handler4 = _interopRequireDefault(_handler3);

var _aggregate = require('./aggregate');

var _aggregate2 = _interopRequireDefault(_aggregate);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _domain = require('./domain');

var _domain2 = _interopRequireDefault(_domain);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  app: _app2.default,
  domain: _domain2.default,
  aggregate: _aggregate2.default,
  command: { handler: handler },
  event: { handler: handler },
  utils: _utils2.default
};