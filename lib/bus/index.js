'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.getDispatcher = getDispatcher;
exports.getBus = getBus;
exports.publish = publish;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _mq_bus = require('./mq_bus');

var _mq_bus2 = _interopRequireDefault(_mq_bus);

var _direct_bus = require('./direct_bus');

var _direct_bus2 = _interopRequireDefault(_direct_bus);

var _message_dispatcher = require('./message_dispatcher');

var _message_dispatcher2 = _interopRequireDefault(_message_dispatcher);

var _err = require('../err');

var _err2 = _interopRequireDefault(_err);

var _i18n = require('../i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var instance = {};

function getDispatcher(type) {
  (0, _assert2.default)(type === 'command' || type === 'event');
  if (!instance[type + 'Dispatcher']) {

    var busConfig = _config2.default.get('bus');

    var dispatcherType = typeof (busConfig[type + 'Dispatcher'] || busConfig.dispatcher) === 'function' ? busConfig[type + 'Dispatcher'] || busConfig.dispatcher : null;

    var dispatcherConfig = (busConfig[type + 'Dispatcher'] || busConfig.dispatcher) == 'message_dipatcher';

    var dispatcher = dispatcherConfig ? new dispatcher() : dispatcherType ? new dispatcherType() : null;

    if (dispatcher === null) throw {
      code: _err2.default.configFailed,
      msg: type + _i18n2.default.t('消息分发器未正确配置，可以在config/bus.js中指定')
    };
    instance[type + 'Dispatcher'] = dispatcher;
  }

  return instance[type + 'Dispatcher'];
}

function getBus(type) {
  (0, _assert2.default)(type === 'command' || type === 'event');
  if (!instance[type + 'Bus']) {
    var busConfig = _config2.default.get('bus');

    var busType = typeof (busConfig[type + 'Bus'] || busConfig.type) === 'function' ? busConfig[type + 'Bus'] || busConfig.type : null;

    var bus = (busConfig[type + 'Bus'] || busConfig.type) === 'mq' ? new _mq_bus2.default() : (busConfig[type + 'Bus'] || busConfig.type) === 'direct' ? new _direct_bus2.default('command', getDispatcher(type)) : busType ? new busType('command', getDispatcher(type)) : null;

    if (bus === null) throw {
      code: _err2.default.configFailed,
      msg: type + _i18n2.default.t('消息总线未正确配置，可以在config/bus.js中指定')
    };

    instance[type + 'Bus'] = bus;
  }

  return instance[type + 'Bus'];
}

function publish(type) {
  (0, _assert2.default)(type === 'command' || type === 'event');

  var msgs = [];

  for (var _len = arguments.length, messages = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    messages[_key - 1] = arguments[_key];
  }

  if (messages.length == 2 && typeof messages[0] === 'string') {
    msgs.push({
      name: messages[0],
      data: message[1]
    });
  } else {
    msgs = messages;
  }

  var bus = getBus(type);
  bus.publish.apply(bus, (0, _toConsumableArray3.default)(msgs));
  bus.commit();
}
//# sourceMappingURL=index.js.map