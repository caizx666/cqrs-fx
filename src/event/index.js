import DomainEventStorage from './domain_event_storage';
import config from '../config';
import err from '../err';

const evtConfig = config.get('event');

let StorageType = typeof evtConfig.storage === 'function' ? evtConfig.storage : 'domain_event';

let storage = evtConfig.storage == 'domain_event' ? new DomainEventStorage() : StorageType ? StorageType() : null;
if (!storage)
  throw Error(
    err.configFailed,
    '事件仓库未正确配置，可以在config/event.js中指定'
  );

export default {
  storage
};
