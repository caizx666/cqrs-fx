import {log, isFunction} from '../utils'
import i18n from '../i18n';

export function getDecoratorToken(fn) {
  if (!isFunction(fn)) {
    log(i18n.t('不是有效的event'))
    return;
  }
  return {name: fn.__eventName, module: fn.__eventModule};
}

export function module(module) {
  return (fn) => {
    if (!isFunction) {
      log(i18n.t('无法定义event属性'));
      return;
    }
    if (module) {
      if (fn.__eventModule) {
        log(i18n.t('eventModule属性冲突'));
      }
      fn.__eventModule = module;
    }
    return fn;
  }
}

export function event(...moduleOrNames) {
  return (target, fnName, fn) => {
    if (!isFunction) {
      log(i18n.t('无法定义event属性'));
      return;
    }
    let module,
      name = fnName;
    if (moduleOrNames.length === 1) {
      const mn = moduleOrNames[0].split('/');
      if (mn.length == 2) {
        module = mn[0];
        name = mn[1];
      } else {
        module = moduleOrNames[0];
        name = null;
      }
    } else if (moduleOrNames.length == 2) {
      module = moduleOrNames[0];
      name = moduleOrNames[1];
    } else {
      log(i18n.t('event属性无效'));
    }
    if (module) {
      if (fn.value.__eventModule) {
        log(i18n.t('eventModule属性冲突'));
      }
      fn.value.__eventModule = module;
    }
    if (name) {
      if (fn.value.__eventName) {
        log(i18n.t('eventName属性冲突'));
      }
      fn.value.__eventName = name;
    }
    return fn;
  }
}
