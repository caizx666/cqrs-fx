import DomainEventStorage from './domain_event_storage';
import config from '../config';
import err from '../err';

const evtConfig = config.get('event');

let StorageType = typeof evtConfig.storage === 'function' ? evtConfig.storage : null;

let storage = evtConfig.storage == 'default' ? new DomainEventStorage() : StorageType ? new StorageType() : null;
if (!storage)
  throw {
    code: err.configFailed,
    msg: '事件仓库未正确配置，可以在config/event.js中指定'
  };

export default {
  storage
};
