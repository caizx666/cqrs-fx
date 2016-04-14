import config from '../config';
import err from '../err';


let repository = config.get('repository').type == 'event_sourced'? event_sourced: null;
if (!repository)
  throw {code:err.configFailed, msg: '领域仓库未正确配置，可以在config/repository.js中指定'};

export default  {
  repository
}
