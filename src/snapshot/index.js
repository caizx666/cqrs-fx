import config from '../config';
import err from '../err';
import i18n from '../i18n';
import SnapshotProvider from './snapshot_provider';
import SnapshotStorage from './snapshot_storage';
import EventSourcedRepository from './event_number_provider';
import MongoSnapshotStorage from './mongo_storage';
import MySqlSnapshotStorage from './mysql_storage';
import RedisSnapshotStorage from './redis_storage';

let provider;
let storage;

export function getStorage() {
  let snapshotStorage = require(`./${snapshotConfig.storage}_storage`);
  let snapshoStorageLoader = typeof snapshotConfig.storage === 'function' ? snapshotConfig.storage : null;

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
  default:
    storageInstance = snapshoStorageLoader ? snapshoStorageLoader() : snapshotConfig.storage;
  }

  if (!(storageInstance instanceof SnapshotStorage)) {
    throw {
      code: err.configFailed,
      msg: '快照数据存储服务未正确配置，可以在config/snapshot.js中指定'
    };
  }
  storage = storageInstance;

  return storageInstance;
}

export function getProvider() {
  if (provider) {
    return provider;
  }

  const snapshotConfig = config.get('snapshot')

  let snapshotProviderLoader = typeof snapshotConfig.provider === 'function' ? snapshotConfig.provider : null;

  let snapshotInstance = snapshotConfig.type == 'event_sourced' ? new EventSourcedRepository() :
    snapshotProviderLoader ? snapshotProviderLoader(getStorage()) : snapshotConfig.provider;

  if (!(snapshotInstance instanceof SnapshotProvider)) {
    throw Error(
      err.configFailed,
      i18n.t('快照提供服务未正确配置，可以在config/snapshot.js中指定')
    );
  }

  provider = snapshotInstance;

  return provider;
}
