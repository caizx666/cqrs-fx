'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _mq_bus = require('./mq_bus');

var _mq_bus2 = _interopRequireDefault(_mq_bus);

var _direct_bus = require('./direct_bus');

var _direct_bus2 = _interopRequireDefault(_direct_bus);

var _message_dipatcher = require('./message_dipatcher');

var _message_dipatcher2 = _interopRequireDefault(_message_dipatcher);

var _err = require('../err');

var _err2 = _interopRequireDefault(_err);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var busConfig = _config2.default.get('bus');

var commandDispatcher = (busConfig.commandDispatcher || busConfig.dispatcher) == 'message_dipatcher' ? new _message_dipatcher2.default() : typeof (busConfig.commandDispatcher || busConfig.dispatcher) === 'function' ? new (busConfig.commandDispatcher || busConfig.dispatcher)() : null;

var eventDispatcher = (busConfig.eventDispatcher || busConfig.dispatcher) == 'message_dipatcher' ? new _message_dipatcher2.default() : typeof (busConfig.eventDispatcher || busConfig.dispatcher) === 'function' ? new (busConfig.eventDispatcher || busConfig.dispatcher)() : null;

if (commandbus == null) throw { code: _err2.default.configFailed, msg: '消息分发器未正确配置，可以在config/bus.js中指定' };
if (eventbus == null) throw { code: _err2.default.configFailed, msg: '事件总线未正确配置，可以在config/bus.js中指定' };

var commandbus = (busConfig.commandBus || busConfig.type) === 'mq' ? new _mq_bus2.default() : (busConfig.commandBus || busConfig.type) === 'direct' ? new _direct_bus2.default() : typeof (busConfig.commandBus || busConfig.type) === 'function' ? new (busConfig.commandBus || busConfig.type)('command', commandDispatcher) : null;

var eventbus = (busConfig.eventBus || busConfig.type) === 'mq' ? new _mq_bus2.default() : (busConfig.eventBus || busConfig.type) === 'direct' ? new _direct_bus2.default() : typeof (busConfig.eventBus || busConfig.type) === 'function' ? new (busConfig.eventBus || busConfig.type)('event', eventDispatcher) : null;

if (commandbus == null) throw { code: _err2.default.configFailed, msg: '命令总线未正确配置，可以在config/bus.js中指定' };
if (eventbus == null) throw { code: _err2.default.configFailed, msg: '事件总线未正确配置，可以在config/bus.js中指定' };

exports.default = {
  eventbus: eventbus,
  commandbus: commandbus,
  publishEvent: function publishEvent() {
    for (var _len = arguments.length, messages = Array(_len), _key = 0; _key < _len; _key++) {
      messages[_key] = arguments[_key];
    }

    if (messages.length == 2 && typeof messages[0] === 'string') {
      bus.publish({
        name: messages[0],
        data: message[1]
      });
    } else {
      bus.publish(messages);
    }
    bus.commit();
  },
  publishCommand: function publishCommand() {
    for (var _len2 = arguments.length, messages = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      messages[_key2] = arguments[_key2];
    }

    if (messages.length == 2 && typeof messages[0] === 'string') {
      commandbus.publish({
        name: messages[0],
        data: message[1]
      });
    } else {
      commandbus.publish(messages);
    }
    commandbus.commit();
  }
};