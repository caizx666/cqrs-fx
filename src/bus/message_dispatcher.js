import {log, isFunction, isString} from '../utils';
import {fxData, _require} from '../core';
import i18n from '../i18n';
import Dispatcher from './dispatcher';
import {getDecoratorToken} from '../command/decorator';
import assert from 'assert';

export default class MessageDispatcher extends Dispatcher {
  _dispatchingListeners = []
  _dispatchFailedListeners = []
  _dispatchedListeners = []

  _handlers = {};

  createAndRegisterAlias() {
    Object.keys(fxData.alias).filter(item => item.indexOf(`/${this.type}/`) > -1).map(alias => _require(alias)).forEach((type) => this.registerHandler(type));
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
    let ctoken = getDecoratorToken(handlerType);
    if (!ctoken.name && !ctoken.module) {
      if (!handlerType.prototype) {
        log(i18n.t('不支持的handler类型'));
      }
      ctoken = {
        module: handlerType.prototype.__module,
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
      const {
        module = ctoken.module,
        name = p
      } = getDecoratorToken(handlerType.prototype[p]);
      if (module && name) {
        let items = this._handlers[`${module}/${name}`];
        if (!items) {
          this._handlers[`${module}/${name}`] = items = [];
        }
        if (!items.find(item => item.CLS.name == handlerType.name && item.method == p)) {
          items.push({CLS: handlerType, method: p});
        }
      }
    }
  }

  unregisterHandler(handler) {
    const ctoken = getDecoratorToken(handlerType);
    for (const p in handlerType.prototype) {
      const {
        module = ctoken.module,
        name
      } = getDecoratorToken(handlerType.prototype[p]);
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
      log(i18n.t('消息id无效'));
      return;
    }
    if (!isString(message.name)) {
      this._onDispatchFaild(message, 'nomessage');
      log(i18n.t('消息name无效'));
      return;
    }
    if (message.type !== 'event' && message.type !== 'command') {
      this._onDispatchFaild(message, 'nomessage');
      log(i18n.t('消息type无效'));
      return;
    }
    if (message.type !== this.type) {
      this._onDispatchFaild(message, 'notsupport');
      log(message.type + i18n.t('消息无法分发'));
      return;
    }
    const id = message.id;
    const module = message.module;
    const name = message.name;
    if (!module) {
      this._onDispatchFaild(message, 'nomodule');
      log(i18n.t('消息module无效'));
      return;
    }
    const handlers = this.getHandlers(name, module);
    if (!handlers || handlers.length <= 0) {
      this._onDispatchFaild(message, 'nohandler');
      log(i18n.t('无消息处理器'));
    }
    log(i18n.t('开始执行') + this.type + ':' + `${module}/${name} (${id})`);
    this._onDispatching(message);
    let curHandler;
    try {
      for (const {CLS, method}
      of handlers) {
        curHandler = null;
        var handler = new CLS();
        curHandler = handler;
        if (!isFunction(handler[method])) {
          log(i18n.t('处理器无法执行命令'));
          continue;
        }
        await handler[method].bind(handler)(message.data || {});
      }
      this._onDispatched(message);
      log(i18n.t('完成执行') + this.type + ':' + `${module}/${name}`);
      return true;
    } catch (err) {
      log(i18n.t('失败执行') + this.type + ':' + `${module}/${name}`);
      console.warn(err, err.stack);
      this._onDispatchFaild(message, 'error', err, curHandler);
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

  _onDispatching(message) {
    this._dispatchingListeners.forEach(listener => {
      try {
        listener(message);
      } catch (e) {
        log(e);
      }
    });
  }

  _onDispatchFaild(message, code, error) {
    this._dispatchFailedListeners.forEach(listener => {
      try {
        listener(message, code, error);
      } catch (e) {
        log(e);
      }
    });
  }

  _onDispatched(message) {
    this._dispatchedListeners.forEach(listener => {
      try {
        listener(message);
      } catch (e) {
        log(e);
      }
    });
  }
}
