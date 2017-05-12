import {log, isFunction, isString} from '../utils';
import {fxData, _require} from '../core';
import i18n from '../i18n';
import Dispatcher from './dispatcher';

export default class MessageDispatcher extends Dispatcher {
  _dispatchingListeners = []
  _dispatchFailedListeners = []
  _dispatchedListeners = []

  getHandlers(type, module, name) {
    console.log(Object.keys(fxData.alias) , type, module, name)
    return Object.keys(fxData.alias).filter(item => item.startsWith(`${module}/${type}/`))
      .map(alias => _require(alias))
      .filter(item => isFunction(item.prototype[name]));
  }

  // message = {name,type,data}
  dispatch(message) {
    if (!isString(message.name) || !isString(message.module) || !isString(message.type) ||
      (message.type != 'event' && message.type != 'command')) {
      log(i18n.t('消息无效'));
      return;
    }

    this._onDispatching();
    const handlers = this.getHandlers(message.type, message.module, message.name);
    let success = 0;
    handlers.forEach(type => {
      var CLS = _require(type);
      if (!CLS || !isFunction(CLS))
        return;
      var handler = new CLS();
      if (!handler || !isFunction(handler[name]))
        return;
      let evt = {
        message,
        module,
        name,
        handler
      };
      log(i18n.t('分发消息') + message.name);
      this._onDispatching(evt);
      try {
        handler[name].call(handler, message.data || {});
        this._onDispatched(evt);
        success++;
        log(i18n.t('分发消息') + message.name + i18n.t('完成'));
      } catch (err) {
        evt.error = err;
        log(i18n.t('分发消息') + message.name + i18n.t('失败，') + err);
        this._onDispatchFaild(evt);
      }
    });
    return success;
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
