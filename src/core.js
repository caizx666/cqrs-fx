import {safeRequire} from './utils';

export const fxData = {
  alias:{},
  export:{}
};

export function alias(type, paths){
  if(!type){
    return fxData.alias;
  }
  //regist alias
  if (!isArray(paths)) {
    paths = [paths];
  }
  paths.forEach(path => {
    let files = getFiles(path);
    files.forEach(file => {
      if(file.slice(-3) !== '.js' || file[0] === '_'){
        return;
      }
      let name = file.slice(0, -3).replace(/\\/g, '/');//replace \\ to / on windows
      name = type + '/' + name;
      fxData.alias[name] = `${path}${sep}${file}`;
    });
  });
};

let _loadRequire = (name, filepath) => {
  let obj = _safeRequire(filepath);
  if (isFunction(obj)) {
    obj.prototype.__type = name;
    obj.prototype.__filename = filepath;
  }
  if(obj){
    fxData.export[name] = obj;
  }
  return obj;
};

export function getType(name, flag){
  if (!isString(name)) {
    return name;
  }
  // adapter or middle by register
  let Cls = fxData.export[name];
  if (Cls) {
    return Cls;
  }

  let filepath = fxData.alias[name];
  if (filepath) {
    return _loadRequire(name, path.normalize(filepath));
  }
  // only check in alias
  if (flag) {
    return null;
  }
  filepath = require.resolve(name);
  return _loadRequire(name, filepath);
};
