import DomainEventStorage from './domain_event_storage';
import EventStorage from './event_storage';
import MySqlStorage from './mysql_storage';
import config from '../config';
import err from '../err';
import i18n from '../i18n';

let eventStorage;

export function getStorage(name) {

  if (eventStorage) {
    return eventStorage;
  }

  const evtConfig = config.get('event');
  let storeageLoader = typeof evtConfig.storage === 'function' ? evtConfig.storage : null;

  let storage;
  switch (name || evtConfig.storage) {
  case 'mysql_domain_event':
    storage = new DomainEventStorage(getStorage('mysql'));
    break;
  case 'mongo_domain_event':
    storage = new DomainEventStorage(getStorage('mongo'));
    break;
  case 'mysql':
    storage = new MySqlStorage();
    break;
  case 'mongo':
    storage = new MySqlStorage();
    break;
  default:
    storage = storeageLoader ? storeageLoader() : evtConfig.storage;
  }

  if (!(storage instanceof EventStorage))
    throw Error(
      err.configFailed,
      i18n.t('事件仓库未正确配置，可以在config/event中配置')
    );

  eventStorage = storage;

  return storage;
}
