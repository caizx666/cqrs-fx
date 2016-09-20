import path from 'path';

import config from './config';
import {
  fxData,
  alias,
  require
} from './core';
import {register} from './register';
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
  isFunction,
  merge
} from './utils';
import WatchCompile from './util/watch_compile';
import AutoReload from './util/auto_reload';

export default class {
  constructor(options, loader) {
    config.init(options || {});
    this._modules = [];
    this._loader = loader;
    this._types = ['command', 'domain', 'event', 'config'];
    this._dirname = {
      command: 'command',
      config: 'config',
      event: 'event',
      domain: 'domain',
    };
  }

  loadSubModule(name) {
    let dir = path.join(config.appPath, name);
    if (isDir(dir)) {
      var dirs = getDirs(dir);
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
        itemType,
        modules: this._modules,
        alias
      });
    }
  }

  loadExts(args) {
    if (isFunction(this._loader)) {
      this._loader(args);
    }
  }

  checkEnv() {
    if (!exists(config.appPath)) {
      throw Error(`appPath "${config.appPath || ''}" not found.`);
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
    register();
  }

  preload() {
    let startTime = Date.now();
    for (let name in fxData.alias) {
      require(name);
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
