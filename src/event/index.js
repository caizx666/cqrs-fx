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

  let storeageLoader = typeof evtConfig.storage === 'function' ? evtConfig.storage : null;

  let storage = evtConfig.storage == 'domain_event' ? new DomainEventStorage() : storeageLoader ? storeageLoader() : evtConfig.storage;
  if (!storage)
    throw Error(
      err.configFailed,
      i18n.t('事件仓库未正确配置，可以在config/event中配置')
    );

  eventStorage = storage;

  return storage;
}
