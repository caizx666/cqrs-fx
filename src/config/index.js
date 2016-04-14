import fs from 'fs';
import path from 'path';

export default class{
  static init(options){
    options = options || {};
    this.rootConfig = __dirname;
    this.configPath = options.configPath;
    this.configCache = {};
    this.initConfig = Object.assign({},options);
  }

 static clear(){
    this.configCache = {};
  }
  // 加载三级配置，cqrs->globalconfig->modduleconfig
  static get(name, moduleConfigPath){
    name = name || 'config';
    if (this.configCache[name])
      return this.configCache[name];
    let filename = path.join(this.rootConfig, name+'.js');
    let json;
    if (fs.existsSync(filename)){
      let str = fs.readFileSync(filename);
      json = JSON.parse(str);
    }else{
      json = {};
    }
    if (this.configPath){
      let filename2 = path.join(this.configPath, name+'.js');
      if (fs.existsSync(filename2)){
        let str2 = fs.readFileSync(filename2);
        let json2 = JSON.parse(str2)
        Object.assign(json, json2);
      }
    }
    if (moduleConfigPath){
      let filename3 = path.join(moduleConfigPath, name+'.js');
      if (fs.existsSync(filename3)){
        let str3 = fs.readFileSync(filename3);
        let json3 = JSON.parse(str3)
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
