import DomainEventStorage from './domain_event_storage';
import config from '../config';
import err from '../err';
import i18n from '../i18n';

let eventStorage;

export function getStorage() {
  const evtConfig = config.get('event');

  if (eventStorage) {
    return eventStorage;
  }

  let StorageType = typeof evtConfig.storage === 'function' ? evtConfig.storage : 'domain_event';

  let storage = evtConfig.storage == 'domain_event' ? new DomainEventStorage() : StorageType ? StorageType() : null;
  if (!storage)
    throw Error(
      err.configFailed,
      i18n.t('事件仓库未正确配置，可以在config/event.js中指定')
    );

  eventStorage = storage;

  return storage;
}
