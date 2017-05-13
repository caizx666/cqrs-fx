import DomainEventStorage from './domain_event_storage';
import EventStorage from './event_storage';
import MySqlEventStorage from './mysql_event_storage';
import MongoEventStorage from './mongo_event_storage';
import MemoryEventStorage from './memory_event_storage';
import config from '../config';
import err from '../err';
import i18n from '../i18n';

let eventStorage;

export function getStorage(name) {

  if (eventStorage) {
    return eventStorage;
  }

  const evtConfig = config.get('event');
  let storeageLoader = typeof evtConfig.storage === 'function'
    ? evtConfig.storage
    : null;

  let storage;
  switch (name || evtConfig.storage) {
    case 'mysql_domain_event':
      storage = new DomainEventStorage(getStorage('mysql'));
      break;
    case 'mongo_domain_event':
      storage = new DomainEventStorage(getStorage('mongo'));
      break;
    case 'memory_domain_event':
      storage = new DomainEventStorage(getStorage('memory'));
      break;
    case 'mysql':
      storage = new MySqlEventStorage();
      break;
    case 'mongo':
      storage = new MongoEventStorage();
      break;
    case 'memory':
      storage = new MemoryEventStorage();
      break;
    default:
      storage = storeageLoader
        ? storeageLoader()
        : evtConfig.storage;
  }

  if (!(storage instanceof EventStorage))
    throw Error(err.configFailed, i18n.t('事件仓库未正确配置，可以在config/event中配置'));

  eventStorage = storage;

  return storage;
}
