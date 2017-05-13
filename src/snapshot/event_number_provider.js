import config from '../config';
import err from '../err';
import SnapshotProvider from './snapshot_provider';
import {getStorage as getSnapshotStorage} from './index';
import {getStorage as getEventStorage} from '../event';
import {uuid} from '../utils';

export default class EventNumberProvider extends SnapshotProvider {
  constructor() {
    super();
    let snapshotConfig = config.get('snapshot');

    this.option = snapshotConfig.option;
    this.numOfEvents = snapshotConfig.numberOfEvents;

    this.snapshotStorage = getSnapshotStorage();
    this.eventStorage = getEventStorage();

    this._snapshotMapping = new Map();
  }

  async hasSnapshot(name, id) {
    if (!name || !id)
      return false;
    var key = name + '/' + id;
    if (this._snapshotMapping.has(key))
      return true;
    let snapshotRecordCnt = await this.snapshotStorage.count({aggregate_root_type: name, aggregate_root_id: id});
    if (snapshotRecordCnt > 0)
      return true;
    else
      return false;
    }

  async getSnapshot(aggregateRootAlias, id) {
    if (!aggregateRootAlias || !id)
      return null;
    var key = aggregateRootAlias + '/' + id;
    if (this._snapshotMapping.has(key))
      return this._snapshotMapping[key];
    let dataObj = await this.snapshotStorage.first({aggregate_root_type: aggregateRootAlias, aggregate_root_id: id});
    if (dataObj == null)
      return null;
    let snapshot = {
      ...dataObj.data,
      id: dataObj.aggregateRootID,
      branch: dataObj.branch,
      version: dataObj.version,
      timestamp: dataObj.timestamp
    };
    this._snapshotMapping.set(key, snapshot);
    return snapshot;
  }

  async canCreateOrUpdateSnapshot(aggregateRoot) {
    if (!aggregateRoot || !aggregateRoot.alias || !aggregateRoot.id)
      return false;
    if (await this.hasSnapshot(aggregateRoot.alias, aggregateRoot.id)) {
      let snapshot = await this.getSnapshot(aggregateRoot.alias, aggregateRoot.id);
      return snapshot.version + this.numOfEvents <= aggregateRoot.version;
    } else {
      let aggregateRootAlias = aggregateRoot.alias;
      let aggregateRootID = aggregateRoot.id;
      let version = aggregateRoot.version;
      let eventCnt = await this.eventStorage.count({
        aggregate_root_type: aggregateRootAlias,
        aggregate_root_id: aggregateRootID,
        version: ['<=', version]
      });
      return eventCnt >= this.numOfEvents;
    }
  }

  async createOrUpdateSnapshot(aggregateRoot) {
    if (!aggregateRoot || !aggregateRoot.alias || !aggregateRoot.id)
      return;
    let snapshot = aggregateRoot.createSnapshot();
    let dataObj = {
      aggregate_root_id: aggregateRoot.id,
      aggregate_root_type: aggregateRoot.alias,
      data: JSON.stringify(snapshot),
      version: aggregateRoot.version,
      branch: aggregateRoot.branch,
      timestamp: aggregateRoot.timestamp
    };
    let key = aggregateRoot.alias + '/' + aggregateRoot.id;
    if (await this.hasSnapshot(aggregateRoot.alias, aggregateRoot.id)) {
      let aggregateRootAlias = aggregateRoot.alias;
      let aggregateRootID = aggregateRoot.id;
      await this.snapshotStorage.update(dataObj, {
        aggregate_root_type: aggregateRootAlias,
        aggregate_root_id: aggregateRootID
      });
      this._snapshotMapping.set(key, snapshot);
    } else {
      dataObj.id = uuid.v1();
      await this.snapshotStorage.insert(dataObj);
      this._snapshotMapping.set(key, snapshot);
    }
  }

  async commit() {
    await this.snapshotStorage.commit();
  }

  async rollback() {
    await this.snapshotStorage.rollback();
  }
}
