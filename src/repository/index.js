import config from '../config';
import err from '../err';

console.log(config.get('repository').type);
let repository = config.get('repository').type?
  require(`./${config.get('repository').type}_repository`): null;
if (!repository)
  throw {code:err.configFailed, msg: '领域仓库未正确配置，可以在config/repository.js中指定'};

export default  {
  repository
}
