import {log, isFunction} from '../utils'
import i18n from '../i18n';

export function getDecoratorToken(fn) {
  if (!isFunction) {
    log(i18n.t('不是有效的command'))
    return;
  }
  return {name: fn.__commandName, module: fn.__commandModule};
}

export function module(module) {
  return (fn) => {
    if (!isFunction) {
      log(i18n.t('无法定义command属性'));
      return;
    }
    if (module) {
      if (fn.__commandModule) {
        log(i18n.t('command属性冲突'));
      }
      fn.__commandModule = module;
    }
    return fn;
  }
}

export function command(...moduleOrNames) {
  return (target, fnName, fn) => {
    if (!isFunction) {
      log(i18n.t('无法定义command属性'));
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
      log(i18n.t('command属性无效'));
    }
    if (module) {
      if (fn.value.__commandModule) {
        log(i18n.t('command属性冲突'));
      }
      fn.value.__commandModule = module;
    }
    if (name) {
      if (fn.value.__commandModule) {
        log(i18n.t('command属性冲突'));
      }
      fn.value.__commandName = name;
    }
    return fn;
  }
}
