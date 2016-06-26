import {
  safeRequire,
  sep,
  exists
} from '../utils';

export default new class {
  constructor() {
    this.rootConfig = __dirname;
    this.configCache = {};
  }

  init(options) {
    options = options || {};
    this.configPath = options.configPath;
    this.initConfig = Object.assign({}, options);
  }

  clear() {
    this.configCache = {};
  }

  // 加载三级配置，cqrs->globalconfig->modduleconfig
  get(name, moduleConfigPath) {
    name = name || 'config';
    if (this.configCache[name])
      return this.configCache[name];
    let filename = this.rootConfig + sep + name + '.js';
    let json = safeRequire(filename) || {};
    if (this.configPath) {
      let filename2 = this.configPath + sep + name + '.js';
      if (exists(filename2)) {
        let json2 = safeRequire(filename2);
        Object.assign(json, json2);
      }
    }
    if (moduleConfigPath) {
      let filename3 = moduleConfigPath + sep + name + '.js';
      if (exists(filename3)) {
        let json3 = safeRequire(filename3);
        Object.assign(json, json3);
      }
    }
    if (this.initConfig && this.initConfig[name]) {
      Object.assign(json, this.initConfig[name]);
    }
    this.configCache[name] = json;
    return json;
  }
}();
