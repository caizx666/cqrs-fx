import config from './config';
import {fxData, alias, getType} from './core';
import register from './register';
import {safeRequire, log, isDir, isFile, join, sep, exists, getDirs, getFiles, isString} from './utils';

export default class{
  constructor(options){
    config.init(options||{});
    this._modules = [];
    this._types = ['command','domain','event'];
    this._dirname = {
      app: 'app',
      command: 'command',
      config: 'config',
      event: 'event',
      domain: 'domain',
    };
  }

  loadSubModule( name ){
    if (!config.appPath) return;
    let path = join(config.appPath, name);
      if(isDir(path)){
        var dirs = getDirs(path);
        if (dirs.length<=0) return;  // 空模块
        let isModule = false;
        for(let name of dirs){
          if (this._types.indexOf(name)>-1){
            isModule = true;
            break;
          }
        }
        if (!isModule){
          for(let dir of dirs){
            this.loadSubModule(join(name, dir));
          }
        }else{
          this._modules.push(name)
        }
      }
  }

  loadModule(){
    this._modules = [];
    this.loadSubModule('');
  }

  // 加载cqrs
  loadCQRS(){
    for(let itemType of this._types){
      this._modules.forEach(module => {
        let name =module.replace(/\\/g,'/');
        let moduleType = name + '/' + itemType;
        let filepath = `${config.appPath}${sep}${module}${sep}${this._dirname[itemType]}`;
        alias(moduleType, filepath);
        if (itemtype == 'command' || itemtype == 'event')
          this._registerHandler(name, itemType, moduletype);
        if (itemtype == 'domain'  )
          this._registerDomain(name, itemType, moduletype);
      });
    }
  }

  _registerDomain(name, moduleType){
    let domain = register['domain'];
    if (!domain) return;
    fxData.alias.forEach(alias=>{
      // 当前新加载的类型
      if (!alias.startWith(moduleType))
        return;
      // 默认模块下的domain都是处理当前模块下的
      let name = alias.substr(moduleType.length+1);
      // 当前模块自动追加模块命名空间成fullname
      let fullName = name.replace(/\//g, '_')+'_'+name;
      domain[fullName] = alias;
    });
  }

  _registerHandler(name, itemtype, moduletype){
    let handlers = register[itemtype+'handler'];
      if (handlers != null){
        handlerConfig = config.get(itemtype+'handler',
           `${config.appPath}${sep}${module}${sep}${this._dirname['config']}`);
        let configtypes = [];
        for(let p in handlerConfig){
          if (!isString(p)) continue;
          let array = handlers[p]||[];
          let items = handlerConfig[p];
          for(let item of items){
            configtypes.push(item);
            if (array.indexOf(item)>-1)
              continue;
            array.push(item);
          }
          handlers[p] = array;
        }
        fxData.alias.forEach(alias=>{
          // 当前新加载的类型
          if (!alias.startWith(moduleType))
            return;
          // 默认模块下的handler都是处理当前模块下的消息
          let name = alias.substr(moduleType.length+1);
          // 如果在配置文件里就是其他模块的消息
          if (configtypes.indexOf(name)>-1)
            return;
          // 当前模块自动追加模块命名空间成fullname
          let fullName = name.replace(/\//g, '_')+'_'+name;
          let array = handlers[fullName]||[];
          if (array.indexOf(alias)>-1)
            return;
          array.push(alias);
          handlers[fullName] = array;
        });
      }
  }

  checkEnv(){
      if (!exists(config.appPath)){
        throw `appPath ${config.appPath} not found.`;
      }
    }

  autoReload(){
      //it auto reload by watch compile
      if(this.compileCallback){
        return;
      }
      let instance = this.getReloadInstance();
      instance.run();
    }

  getReloadInstance(srcPath){
      srcPath = srcPath || config.appPath;
      let instance = new AutoReload(srcPath, () => {
        this.clearData();
        this.load();
      });
      return instance;
    }

  compile(srcPath, outPath, ...options){
    srcPath = srcPath || config.srcPath;
    outPath = outPath || config.appPath;
    if(isDir(srcPath)){
      let reloadInstance = this.getReloadInstance(outPath);
      this.compileCallback = changedFiles => {
        reloadInstance.clearFilesCache(changedFiles);
      };
      let instance = new WatchCompile(srcPath, outPath, options, this.compileCallback);
      instance.run();
      console.log(`watch ${srcPath} for compile...`);
    }
  }

  clearData(){
    if (this._modules){
      fxData.alias = {};
      fxData.export = {};
    }
  }

  load(){
    this.checkEnv();
    this.loadModule();
    this.loadCQRS();
    this.loadApp();
  }

  preload(){
    let startTime = Date.now();
    for(let name in fxData.alias){
      getType(fxData.alias[name]);
    }
    log('cqrs preload packages finished', 'PRELOAD', startTime);
  }

  run(preload){
    this.load();
    this.autoReload();
    if (preload){
      this.preload();
    }
  }
}
