import {
  fxData,
  alias,
  _require
} from './core';

export const registry = {
  eventhandler: {
    // xxxevent: []
  },
  commandhandler: {

  },
  domain: {

  }
};

export function register() {
  // 注册处理器和domain对象
  _registerHandler('command');
  _registerHandler('event');
  _registerDomain('domain');
}

function _registerDomain(itemType) {
  let domain = registry.domain;
  if (!domain) return;
  for (let alias in fxData.alias) {
    if (alias.indexOf('/' + itemType + '/'))
      domain[alias] = alias;
  }
}

function _registerHandler(itemType) {
  let handlers = registry[itemType + 'handler'];
  if (handlers !== null) {
    // 先注册配置文件中定义的handler，配置文件中可以配置其他模块的handler
    for (let alias in fxData.alias) {
      if (alias.indexOf('/config/' + itemType + 'handler') == -1)
        continue;
      let handlerConfig = config.get(itemType + 'handler');
      handlerConfig = merge(handlerConfig, _require(alias));
      for (let p in handlerConfig) {
        if (!isString(p)) continue;
        let array = handlers[p] || [];
        let items = handlerConfig[p];
        for (let item of items) {
          if (array.indexOf(item) > -1)
            continue;
          // 如果handler文件不存在跳过
          if (!fxData.alias[`${module}/${itemType}/${item}`])
            continue;
          // 注册
          array.push(item);
        }
        handlers[p] = array;
      }
    }
    // 补充默认handler文件夹中的handler
    for (let alias in fxData.alias) {
      if (alias.indexOf('/' + itemType + '/') == -1)
        continue;
      let messageType = alias.trimRight('handler');
      let array = handlers[messageType] || [];
      if (array.indexOf(alias) > -1)
        return;
      // 要是已经在配置文件中注册，就不注册默认事件
      // 注册
      array.push(alias);
      handlers[messageType] = array;
    }
  }
}
