import {
  log,
  isFunction,
  isString
} from '../utils';
import {
  _require
} from '../core';
import {
  registry
} from '../register';
import i18n from '../i18n';

export default class MessageDispatcher {
  constructor() {
    this._dispatchingListeners = [];
    this._dispatchFailedListeners = [];
    this._dispatchedListeners = [];
  }

  // message = {name,type,data}
  dispatch(message) {
    if (!isString(message.name) || !isString(message.type) ||
      (message.type != 'event' && message.type != 'command')) {
      log(i18n.t('消息无效'));
      return;
    }
    let handlerReg = registry[message.type + 'handler'];
    if (!handlerReg) {
      log(i18n.t('消息' + message.type + '类型尚未支持'));
      return;
    }
    this._onDispatching();
    let handlers = handlerReg[message.name] || [];
    handlers.forEach(type => {
      var CLS = _require(type);
      if (!CLS || !isFunction(CLS)) return;
      var handler = new CLS();
      if (!handler || !isFunction(handler.run)) return;
      let evt = {
        message,
        CLS,
        handler
      };
      log(i18n.t('分发消息') + message.name);
      this._onDispatching(evt);
      try {
        handler.run(message.data || {});
        this._onDispatched(evt);
        log(i18n.t('分发消息') + message.name + i18n.t('完成'));
      } catch (err) {
        evt.err = err;
        log(i18n.t('分发消息') + message.name + i18n.t('失败，') + err);
        this._onDispatchFaild(evt);
      }
    });
  }

  clear() {
    this._dispatchingListeners.clear();
    this._dispatchFailedListeners.clear();
    this._dispatchedListeners.clear();
  }

  addListener(dispatchingListener, dispatchedListener, dispatchFailedListener) {
    if (isFunction(dispatchedListener))
      this._dispatchingListeners.push(dispatchedListener);
    if (isFunction(dispatchedListener))
      this._dispatchedListeners.push(dispatchedListener);
    if (isFunction(dispatchFailedListener))
      this._dispatchFailedListeners.push(dispatchFailedListener);
  }

  _onDispatching(event) {
    this._dispatchingListeners.forEach(listener => {
      try {
        listener(event);
      } catch (e) {
        log(e);
      }
    });
  }

  _onDispatchFaild(event) {
    this.dispatchFailedListener.forEach(listener => {
      try {
        listener(event);
      } catch (e) {
        log(e);
      }
    });
  }

  _onDispatched(event) {
    this.dispatchedListener.forEach(listener => {
      try {
        listener(event);
      } catch (e) {
        log(e);
      }
    });
  }
}
