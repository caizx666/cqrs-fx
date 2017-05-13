import {log, isFunction, isString} from '../utils';
import {fxData, _require} from '../core';
import i18n from '../i18n';
import Dispatcher from './dispatcher';

export default class MessageDispatcher extends Dispatcher {
  _dispatchingListeners = []
  _dispatchFailedListeners = []
  _dispatchedListeners = []

  getHandlers(type, module, name) {
    return Object.keys(fxData.alias).filter(item => item.startsWith(`${module}/${type}/`)).map(alias => _require(alias)).filter(item => isFunction(item.prototype[name]));
  }

  // message = {name,module,type,data}
  dispatch(message) {
    if (!message.name || !isString(message.name)) {
      log(i18n.t('消息name无效'));
      return;
    }
    if (message.type !== 'event' && message.type !== 'command') {
      log(i18n.t('消息type无效'));
      return;
    }

    let module;
    let name;
    if (!message.module) {
      const mn = message.name.split('/');
      if (mn.length == 2) {
        module = mn[0];
        name = mn[1];
      }
    } else {
      module = message.module;
      name = message.name;
    }
    if (!module) {
      log(i18n.t('消息module无效'));
      return;
    }
    const handlers = this.getHandlers(message.type, module, name);
    let success = 0;
    handlers.forEach(type => {
      var CLS = _require(type);
      if (!CLS || !isFunction(CLS))
        return;
      var handler = new CLS();
      if (!handler || !isFunction(handler[name]))
        return;
      const evt = {
        type: message.type,
        data: message.data,
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
    if (isFunction(dispatchingListener))
      this._dispatchingListeners.push(dispatchingListener);
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
    this._dispatchFailedListeners.forEach(listener => {
      try {
        listener(event);
      } catch (e) {
        log(e);
      }
    });
  }

  _onDispatched(event) {
    this._dispatchedListeners.forEach(listener => {
      try {
        listener(event);
      } catch (e) {
        log(e);
      }
    });
  }
}
