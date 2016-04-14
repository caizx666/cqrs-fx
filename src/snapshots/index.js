import config from '../config';
import err from '../err';

let provider = require(`./${config.get('snapshot').provider}_provider`);
if (!provider)
  throw {code:err.configFailed, msg: '快照提供服务未正确配置，可以在config/snapshot.js中指定'};

export default{
  provider
}
