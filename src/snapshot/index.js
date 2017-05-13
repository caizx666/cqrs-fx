import config from '../config';
import err from '../err';
import i18n from '../i18n';
import SnapshotProvider from './snapshot_provider';
import SnapshotStorage from './snapshot_storage';
import EventNumberProvider from './event_number_provider';
import MongoSnapshotStorage from './mongo_snapshot_storage';
import MySqlSnapshotStorage from './mysql_snapshot_storage';
import RedisSnapshotStorage from './redis_snapshot_storage';
import MemorySnapshotStorage from './memory_snapshot_storage';

let provider;
let storage;

export function getStorage() {

  if (storage) {
    return storage;
  }

  const snapshotConfig = config.get('snapshot');

  let snapshoStorageLoader = typeof snapshotConfig.storage === 'function'
    ? snapshotConfig.storage
    : null;

  let storageInstance;
  switch (snapshotConfig.storage) {
    case 'mongo':
      storageInstance = new MongoSnapshotStorage();
      break;
    case 'mysql':
      storageInstance = new MySqlSnapshotStorage();
      break;
    case 'redis':
      storageInstance = new RedisSnapshotStorage();
      break;
    case 'memory':
      storageInstance = new MemorySnapshotStorage();
      break;
    default:
      storageInstance = snapshoStorageLoader
        ? snapshoStorageLoader()
        : snapshotConfig.storage;
  }

  if (!(storageInstance instanceof SnapshotStorage)) {
    throw new Error( err.configFailed,  '快照数据存储服务未正确配置，可以在config/snapshot.js中指定');
  }
  storage = storageInstance;

  return storageInstance;
}

export function getProvider() {
  if (provider) {
    return provider;
  }

  const snapshotConfig = config.get('snapshot');

  let snapshotProviderLoader = typeof snapshotConfig.provider === 'function'
    ? snapshotConfig.provider
    : null;

  let snapshotInstance = snapshotConfig.provider == 'event_number'
    ? new EventNumberProvider()
    : snapshotProviderLoader
      ? snapshotProviderLoader()
      : snapshotConfig.provider;

  if (!(snapshotInstance instanceof SnapshotProvider)) {
    throw Error(err.configFailed, i18n.t('快照提供服务未正确配置，可以在config/snapshot.js中指定'));
  }

  provider = snapshotInstance;

  return provider;
}
