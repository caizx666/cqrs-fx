import DomainEventStorage from './domain_event_storage';
import EventStorage from './event_storage';
import MySqlEventStorage from './mysql_event_storage';
import MongoEventStorage from './mongo_event_storage';
import MemoryEventStorage from './memory_event_storage';
import config from '../config';
import err from '../err';
import i18n from '../i18n';
import {fxData} from '../core';

export function getStorage(name = null) {

  if (fxData.container.eventStorage) {
    return fxData.container.eventStorage;
  }

  const evtConfig = config.get('event');
  let storeageLoader = typeof evtConfig.storage === 'function'
    ? evtConfig.storage
    : null;

  let storage;
  switch (name || evtConfig.storage) {
    case 'mysql_domain_event':
      storage = new DomainEventStorage(new MySqlEventStorage());
      break;
    case 'mongo_domain_event':
      storage = new DomainEventStorage(new MongoEventStorage());
      break;
    case 'memory_domain_event':
      storage = new DomainEventStorage(new MemoryEventStorage());
      break; 
    default:
      storage = storeageLoader
        ? storeageLoader()
        : evtConfig.storage;
  }

  if (!(storage instanceof EventStorage))
    throw Error(err.configFailed, i18n.t('事件仓库未正确配置，可以在config/event中配置'));

  fxData.container.eventStorage = storage;

  return storage;
}
