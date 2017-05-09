import assert from 'assert';

import config from '../config';
import mqbus from './mq_bus';
import directbus from './direct_bus';
import dispatcher from './message_dispatcher';
import err from '../err';
import i18n from '../i18n';

const instance = {};

export function getDispatcher(type) {
  assert(type === 'command' || type === 'event');
  if (!instance[type + 'Dispatcher']) {

    const busConfig = config.get('bus');

    let dispatcherType = typeof (busConfig[type + 'Dispatcher'] || busConfig.dispatcher) === 'function' ?
      (busConfig[type + 'Dispatcher'] || busConfig.dispatcher) : null;

    let dispatcherConfig = (busConfig[type + 'Dispatcher'] || busConfig.dispatcher) == 'message_dipatcher';

    var dispatcher = dispatcherConfig ? new dispatcher() :
      (dispatcherType ? new dispatcherType() : null);

    if (dispatcher === null)
      throw {
        code: err.configFailed,
        msg: type + i18n.t('消息分发器未正确配置，可以在config/bus.js中指定')
      };
    instance[type + 'Dispatcher'] = dispatcher;
  }

  return instance[type + 'Dispatcher'];
}

export function getBus(type) {
  assert(type === 'command' || type === 'event');
if (!instance[type + 'Bus']) {
  const busConfig = config.get('bus');

  let busType = typeof (busConfig[type + 'Bus'] || busConfig.type) === 'function' ?
    (busConfig[type + 'Bus'] || busConfig.type) : null;

  var bus = (busConfig[type + 'Bus'] || busConfig.type) === 'mq' ? new mqbus() :
    (busConfig[type + 'Bus'] || busConfig.type) === 'direct' ? new directbus('command', getDispatcher(type)) :
    busType ? new busType('command', getDispatcher(type)) : null;

  if (bus === null)
    throw {
      code: err.configFailed,
      msg: type + i18n.t('消息总线未正确配置，可以在config/bus.js中指定')
    };

    instance[type + 'Bus'] = bus;
  }

  return instance[type + 'Bus'];
}

export function publish(type, ...messages) {
  assert(type === 'command' || type === 'event');

  let msgs = [];
  if (messages.length == 2 && typeof messages[0] === 'string') {
    msgs.push({
      name: messages[0],
      data: message[1]
    });
  } else {
    msgs = messages;
  }

  const bus = getBus(type);
  bus.publish(...msgs);
  bus.commit();
}
