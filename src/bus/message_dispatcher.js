import {
  log,
  warn,
  isFunction,
  isString,
  getClassName
} from '../utils';
import {
  fxData,
  _require
} from '../core';
import i18n from '../i18n';
import Dispatcher from './dispatcher';
import {
  getDecoratorToken as getCommandToken
} from '../command/decorator';
import {
  getDecoratorToken as getEventToken
} from '../event/decorator';
import assert from 'assert';

export default class MessageDispatcher extends Dispatcher {
  _dispatchingListeners = []
  _dispatchFailedListeners = []
  _dispatchedListeners = []

  _handlers = {};

  createAndRegisterAlias() {
    this._handlers = {};
    Object.keys(fxData.alias).filter(alias => alias.split('/')[1] === this.type).map(alias => _require(alias)).forEach((type) => this.registerHandler(type));
  }

  getHandlers(name, module) {
    assert(name);
    if (!module) {
      const mn = name.split('/');
      module = mn[0];
      name = mn[1];
    }
    assert(module);
    return this._handlers[`${module}/${name}`] || [];
  }

  registerHandler(handlerType) {
    assert(handlerType);
    let ctoken = this.type === 'event' ?
      getEventToken(handlerType) :
      getCommandToken(handlerType);
    if (!ctoken.name && !ctoken.module) {
      if (!handlerType.prototype) {
        warn(i18n.t('不支持的handler类型'));
      }
      ctoken = {
        module: handlerType.prototype.__module || handlerType.$packageName,
        name: handlerType.name
      };
    }
    for (const p of Object.getOwnPropertyNames(handlerType.prototype)) {
      if (p === 'constructor') {
        continue;
      }
      if (!isFunction(handlerType.prototype[p])) {
        continue;
      }
      let {
        module = ctoken.module,
          name = p
      } = this.type === 'event' ?
        getEventToken(handlerType.prototype[p]) :
        getCommandToken(handlerType.prototype[p]);
      if (module && name) {
        let items = this._handlers[`${module}/${name}`];
        if (!items) {
          this._handlers[`${module}/${name}`] = items = [];
        }
        if (!items.find(item => item.CLS == handlerType && item.method == p)) {
          items.push({
            CLS: handlerType,
            method: p
          });
          log(i18n.t('注册'), getClassName(handlerType) + '.' + p, '=>', `${module}/${name}`);
        } else {
          log(i18n.t('跳过'), getClassName(handlerType) + '.' + p)
        }
      } else {
        warn(i18n.t('注册失败，模块未知'), getClassName(handlerType) + '.' + p)
      }
    }
  }

  unregisterHandler(handler) {
    const ctoken = this.type === 'event' ?
      getEventToken(handlerType) :
      getCommandToken(handlerType);
    for (const p in handlerType.prototype) {
      const {
        module = ctoken.module,
          name
      } = this.type === 'event' ?
        getEventToken(handlerType.prototype[p]) :
        getCommandToken(handlerType.prototype[p]);
      if (module && name) {
        let items = this._handlers[`${module}/${name}`];
        if (!items) {
          continue;
        }
        const item = items.find(item => item.CLS === handler);
        if (!item) {
          continue;
        }
        items.splice(items.indexOf(item), 1);
      }
    }
  }

  // message = {name,module,type,data}
  async dispatch(message) {
    if (!isString(message.id)) {
      this._onDispatchFaild(message, 'nomessage');
      warn(i18n.t('消息id无效'));
      return;
    }
    if (!isString(message.name)) {
      this._onDispatchFaild(message, 'nomessage');
      warn(i18n.t('消息name无效'));
      return;
    }
    if (message.type !== 'event' && message.type !== 'command') {
      this._onDispatchFaild(message, 'nomessage');
      warn(i18n.t('消息type无效'));
      return;
    }
    if (message.type !== this.type) {
      this._onDispatchFaild(message, 'notsupport');
      warn(message.type + i18n.t('消息无法分发'));
      return;
    }
    const id = message.id;
    const module = message.module;
    const name = message.name;
    if (!module) {
      this._onDispatchFaild(message, 'nomodule');
      warn(i18n.t('消息module无效'));
      return;
    }
    const handlers = this.getHandlers(name, module);
    if (!handlers || handlers.length <= 0) {
      this._onDispatchFaild(message, 'nohandler');
      warn(i18n.t('无消息处理器'));
    }
    log(i18n.t('开始执行'), this.type, `${module}/${name} (${id})`);
    await this._onDispatching(message);
    let curHandler;
    try {
      for (const {
          CLS,
          method
        } of handlers) {
        curHandler = null;
        var handler = new CLS();
        curHandler = handler;
        if (!isFunction(handler[method])) {
          warn(i18n.t('处理器无法执行命令'));
          continue;
        }
        await handler[method].bind(handler)(message.data || {});
      }
      await this._onDispatched(message);
      log(i18n.t('完成执行'), this.type, `${module}/${name} (${id})`);
      return true;
    } catch (err) {
      warn(i18n.t('失败执行'), this.type, `${module}/${name} (${id})`, err);
      await this._onDispatchFaild(message, 'error', err, curHandler);
      return false;
    }
  }

  clear() {
    this._dispatchingListeners.clear();
    this._dispatchFailedListeners.clear();
    this._dispatchedListeners.clear();
  }

  addListener(dispatchingListener, dispatchedListener, dispatchFailedListener) {
    if (isFunction(dispatchingListener))
      this._dispatchingListeners.push(dispatchingListener);
    if (isFunction(dispatchedListener))
      this._dispatchedListeners.push(dispatchedListener);
    if (isFunction(dispatchFailedListener))
      this._dispatchFailedListeners.push(dispatchFailedListener);
  }

  removeListener(dispatchingListener, dispatchedListener, dispatchFailedListener) {
    if (isFunction(dispatchingListener))
      this._dispatchingListeners.splice(this._dispatchingListeners.indexOf(dispatchingListener), 1);
    if (isFunction(dispatchedListener))
      this._dispatchedListeners.splice(this._dispatchedListeners.indexOf(dispatchedListener), 1);
    if (isFunction(dispatchFailedListener))
      this._dispatchFailedListeners.splice(this._dispatchFailedListeners.indexOf(dispatchFailedListener), 1);
  }

  async _onDispatching(message) {
    for (const listener of this._dispatchingListeners) {
      try {
        await listener(message);
      } catch (e) {
        warn(e);
      }
    }
  }

  async _onDispatchFaild(message, code, error) {
    for (const listener of this._dispatchFailedListeners) {
      try {
        await listener(message, code, error);
      } catch (e) {
        warn(e);
      }
    }
  }

  async _onDispatched(message) {
    for (const listener of this._dispatchedListeners) {
      try {
        await listener(message, 'ok');
      } catch (e) {
        warn(e);
      }
    }
  }
}
