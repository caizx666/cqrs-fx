import path from 'path';

import config from './config';
import {
  fxData,
  alias,
  getType
} from './core';
import register from './register';
import {
  safeRequire,
  log,
  isDir,
  isFile,
  sep,
  exists,
  getDirs,
  getFiles,
  isString,
  isFunction
} from './utils';
import WatchCompile from './util/watch_complile';
import AutoReload from './util/auto_reload';

export default class {
  constructor(options, loader) {
    config.init(options || {});
    this._modules = [];
    this._loader = loader;
    this._types = ['command', 'domain', 'event'];
    this._dirname = {
      command: 'command',
      config: 'config',
      event: 'event',
      domain: 'domain',
    };
  }

  loadSubModule(name) {
    let path = path.join(config.appPath, name);
    if (isDir(path)) {
      var dirs = getDirs(path);
      if (dirs.length <= 0) return; // 空模块
      let isModule = false;
      for (let name of dirs) {
        if (this._types.indexOf(name) > -1) {
          isModule = true;
          break;
        }
      }
      if (!isModule) {
        for (let dir of dirs) {
          this.loadSubModule(path.join(name, dir));
        }
      } else {
        this._modules.push(name);
      }
    }
  }

  loadModule() {
    this._modules = [];
    this.loadSubModule('');
  }

  // 加载cqrs
  loadCQRS() {
    for (let itemType of this._types) {
      this._modules.forEach(module => {
        let name = module.replace(/\\/g, '/');
        let moduleType = name + '/' + itemType;
        let filepath = `${config.appPath}${sep}${module}${sep}${this._dirname[itemType]}`;
        alias(moduleType, filepath);
      });
      // 支持加载扩展对象定义
      this.loadExts({
        itemtype,
        modules: this._modules,
        alias
      });
    }
    // 注册处理器和domain对象
    for (let itemType of this._types) {
      if (itemtype == 'command' || itemtype == 'event')
        this._registerHandler(name, itemType);
      if (itemtype == 'domain')
        this._registerDomain(name, itemType);
    }
  }

  loadExts(args) {
    if (isFunction(this._loader)) {
      this._loader(args);
    }
  }

  _registerDomain(name, itemType) {
    let domain = register.domain;
    if (!domain) return;
    for (let alias in fxData.alias) {
      if (alias.indexOf('/' + itemType + '/'))
        domain[alias] = alias;
    }
  }

  _registerHandler(name, itemtype) {
    let handlers = register[itemtype + 'handler'];
    if (handlers !== null) {
      // 先注册配置文件中定义的handler，配置文件中可以配置其他模块的handler
      this._modules.forEach(module => {
        let handlerConfig = config.get(itemType + 'handler',
          `${config.appPath}${sep}${module}${sep}${this._dirname.config}`);
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
      });
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

  checkEnv() {
    if (!exists(config.appPath)) {
      throw `appPath ${config.appPath} not found.`;
    }
  }

  autoReload() {
    //it auto reload by watch compile
    if (this.compileCallback) {
      return;
    }
    let instance = this.getReloadInstance();
    instance.run();
  }

  getReloadInstance(srcPath) {
    srcPath = srcPath || config.appPath;
    let instance = new AutoReload(srcPath, () => {
      this.clearData();
      this.load();
    });
    return instance;
  }

  compile(srcPath, outPath, options = {}) {
    srcPath = srcPath || `${config.appPath}${sep}..${sep}src`;
    outPath = outPath || config.appPath;
    if (isDir(srcPath)) {
      let reloadInstance = this.getReloadInstance(outPath);
      this.compileCallback = changedFiles => {
        reloadInstance.clearFilesCache(changedFiles);
      };
      let instance = new WatchCompile(srcPath, outPath, options, this.compileCallback);
      instance.run();
      console.log(`watch ${srcPath} for compile...`);
    }
  }

  clearData() {
    if (this._modules) {
      fxData.alias = {};
      fxData.export = {};
    }
  }

  load() {
    this.checkEnv();
    this.loadModule();
    this.loadCQRS();
  }

  preload() {
    let startTime = Date.now();
    for (let name in fxData.alias) {
      getType(fxData.alias[name]);
    }
    log('cqrs preload packages finished', 'PRELOAD', startTime);
  }

  run(preload) {
    this.load();
    this.autoReload();
    if (preload) {
      this.preload();
    }
  }
}
