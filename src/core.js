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

let _interopSafeRequire = file => {
  let obj = require(file);
  if(obj && obj.__esModule && obj.default){
    return obj.default;
  }
  return obj;
};

let _safeRequire = file => {
  // absolute file path is not exist
  if (path.isAbsolute(file)) {
    //no need optimize, only invoked before service start
    if(!isFile(file)){
      return null;
    }
    //when file is exist, require direct
    return _interopSafeRequire(file);
  }
  try{
    return _interopSafeRequire(file);
  }catch(err){
    log(err);
  }
  return null;
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
