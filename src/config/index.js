import {safeRequire,join,exists} from '../utils';
import path from 'path';

export default new class{
  constructor (options){
    options = options || {};
    this.rootConfig = __dirname;
    this.configPath = options.configPath;
    this.configCache = {};
    if (options.appPath){
      this.appPath = path.normalize(options.appPath);
      this.srcPath = path.normalize(options.srcPath || `${options.appPath}${sep}..${sep}src`);
    }
    else if (options.srcPath){
      this.appPath = path.normalize(options.appPath || `${options.srcPath}${sep}..${sep}app`);
      this.srcPath = path.normalize(options.srcPath);
    }
    this.initConfig = Object.assign({},options);
  }

  clear(){
    this.configCache = {};
  }

  // 加载三级配置，cqrs->globalconfig->modduleconfig
   get(name, moduleConfigPath){
    name = name || 'config';
    if (this.configCache[name])
      return this.configCache[name];
    let filename = join(this.rootConfig , name+'.js');
    let json = safeRequire(filename) || {};
    if (this.configPath){
      let filename2 = join(this.configPath , name+'.js');
      if (exists(filename2)){
        let json2 = safeRequire(filename2);
        Object.assign(json, json2);
      }
    }
    if (moduleConfigPath){
      let filename3 = join(moduleConfigPath , name+'.js');
      if (exists(filename3)){
        let json3 = safeRequire(filename3);
        Object.assign(json, json3);
      }
    }
    if (this.initConfig && this.initConfig[name]){
      Object.assign(json, this.initConfig[name]);
    }
    this.configCache[name] = json;
    return json;
  }
}
