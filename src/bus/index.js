import assert from 'assert';
import err from '../err';
import i18n from '../i18n';
import config from '../config';
import Bus from './bus';
import Dispatcher from './dispatcher';
import mqbus from './mq_bus';
import mqworker from './mq_worker';
import directbus from './direct_bus';
import MessageDispatcher from './message_dispatcher';
import {fxData} from '../core';

export function getDispatcher(type) {
  assert(type === 'command' || type === 'event');
  if (!fxData.container[type + 'Dispatcher']) {

    const busConfig = config.get('bus');

    let dispatcherLoader = typeof(busConfig[type + 'Dispatcher'] || busConfig.dispatcher) === 'function'
      ? (busConfig[type + 'Dispatcher'] || busConfig.dispatcher)
      : null;

    let dispatcherConfig = (busConfig[type + 'Dispatcher'] || busConfig.dispatcher) == 'message_dipatcher';

    var dispatcher = dispatcherConfig
      ? new MessageDispatcher(type)
      : (dispatcherLoader
        ? dispatcherLoader(type)
        : (busConfig[type + 'Dispatcher'] || busConfig.dispatcher));

    if (!(dispatcher instanceof Dispatcher)) {
      throw new Error(err.configFailed, type + i18n.t('消息分发器未正确配置，可以在config/bus.js中指定'));
    }
    dispatcher.createAndRegisterAlias();
    fxData.container[type + 'Dispatcher'] = dispatcher;
  }

  return fxData.container[type + 'Dispatcher'];
}

export function getEventDispatcher() {
  return getDispatcher('event');
}

export function getCommandDispatcher() {
  return getDispatcher('command');
}

export function getBus(type) {
  assert(type === 'command' || type === 'event');
  if (!fxData.container[type + 'Bus']) {
    const busConfig = config.get('bus');

    let loader = typeof(busConfig[type + 'Bus'] || busConfig.type) === 'function'
      ? (busConfig[type + 'Bus'] || busConfig.type)
      : null;

    var bus = (busConfig[type + 'Bus'] || busConfig.type) === 'mq'
      ? new mqbus(type)
      : (busConfig[type + 'Bus'] || busConfig.type) === 'direct'
        ? new directbus(type)
        : loader
          ? new loader(type)
          : null;

    if (!(bus instanceof Bus))
      throw new Error( err.configFailed,
       type + i18n.t('消息总线未正确配置，可以在config/bus.js中指定')
     );

    fxData.container[type + 'Bus'] = bus;
  }

  return fxData.container[type + 'Bus'];
}

export function getEventBus() {
  return getBus('event');
}

export function getCommandBus() {
  return getBus('command');
}

export async function publish(type, ...messages) {
  assert(type === 'command' || type === 'event');

  let msgs = [];
  if (messages.length == 3 && typeof messages[0] === 'string') {
    msgs.push({module: messages[0], name: message[1], data: message[2]});
  } else if (messages.length == 2 && typeof messages[0] === 'string') {
    const mn = messages[0].split('/');
    if (mn.length != 2) {
      throw new Error(i18n.t('消息name需要包含module/name信息'));
    }
    msgs.push({module: mn[0], name: mn[1], data: message[1]});
  } else {
    msgs = messages;
  }

  const bus = getBus(type);
  bus.publish(...msgs);
  await bus.commit();
}

export async function publishEvent(...messages) {
  await publish('event', ...messages);
}

export async function publishCommand(...messages) {
  await publish('command', ...messages);
}

export function getWorker() {
  if (fxData.container.mqworker) {
    return fxData.container.mqworker;
  }
  return fxData.container.mqworker = new mqworker;
}
