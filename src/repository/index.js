import config from '../config';
import err from '../err';

let repository = config.get('repository').type ?
  require(`./${config.get('repository').type}_repository`) : null;

if (!repository)
  throw Error(
    err.configFailed,
    '领域仓库未正确配置，可以在config/repository.js中指定'
  );

export default {
  repository
};
