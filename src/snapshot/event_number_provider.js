import config from '../config';
import err from '../err';
import eventStorage from '../event/domain_event_storage';
import uuid from 'node-uuid';

export default class {
  constructor() {
    let snapshotConfig = config.get('snapshot');
    let snapshotStorage = require(`./${snapshotConfig.storage}_storage`);
    if (!snapshotStorage)
      throw {
        code: err.configFailed,
        msg: '快照数据存储服务未正确配置，可以在config/snapshot.js中指定'
      };

    this.option = snapshotConfig.option;
    this.numOfEvents = snapshotConfig.numberOfEvents;

    this.snapshotStorage = snapshotStorage;
    this.eventStorage = eventStorage;

    this._snapshotMapping = new Map();
  }

  async hasSnapshot(name, id) {
    if (!name || !id) return false;
    var key = name + '/' + id;
    if (this._snapshotMapping.keys().indexOf(key) > -1)
      return true;
    let snapshotRecordCnt = await this.snapshotStorage.count({
      aggregate_root_type: name,
      aggregate_root_id: id
    });
    if (snapshotRecordCnt > 0)
      return true;
    else
      return false;
  }

  async getSnapshot(name, id) {
    if (!name || !id) return null;
    var key = name + '/' + id;
    if (this._snapshotMapping.keys().indexOf(key) > -1)
      return this._snapshotMapping[key];
    let dataObj = await this.snapshotStorage.first({
      aggregate_root_type: name,
      aggregate_root_id: id
    });
    if (dataObj == null)
      return null;
    let snapshot = Object.assgin(JSON.parse(dataObj.data), {
      id: dataObj.aggregateRootID,
      branch: dataObj.branch,
      version: dataObj.version,
      timestamp: dataObj.timestamp
    });
    this._snapshotMapping.set(key, snapshot);
    return snapshot;
  }

  async canCreateOrUpdateSnapshot(aggregateRoot) {
    if (!aggregateRoot || !aggregateRoot.prototype.__type || !aggregateRoot.id) return false;
    if (await this.hasSnapshot(aggregateRoot.prototype.__type, aggregateRoot.id)) {
      let snapshot = await this.getSnapshot(aggregateRoot.prototype.__type, aggregateRoot.id);
      return snapshot.version + this.numOfEvents <= aggregateRoot.version;
    } else {
      let aggregateRootType = aggregateRoot.prototype.__type;
      let aggregateRootID = aggregateRoot.id;
      let version = aggregateRoot.version;
      let eventCnt = await this.eventStorage.count({
        aggregate_root_type: aggregateRootType,
        aggregate_root_id: aggregateRootID,
        version: ['<=', version]
      });
      return eventCnt >= this.numOfEvents;
    }
  }

  async createOrUpdateSnapshot(aggregateRoot) {
    if (!aggregateRoot || !aggregateRoot.prototype.__type || !aggregateRoot.id) return;
    let snapshot = aggregateRoot.createSnapshot();
    let dataObj = {
      aggregateRootID: aggregateRoot.id,
      aggregateRootType: aggregateRoot.prototype.__name,
      data: JSON.stringify(snapshot),
      version: aggregateRoot.version,
      branch: aggregateRoot.branch,
      timestamp: aggregateRoot.timestamp
    };
    let key = aggregateRoot.prototype.__type + '/' + aggregateRoot.id;
    if (await this.hasSnapshot(aggregateRoot.prototype.__type, aggregateRoot.id)) {
      let aggregateRootType = aggregateRoot.prototype.__type;
      let aggregateRootID = aggregateRoot.id;
      await this.snapshotStorage.update(dataObj, {
        aggregate_root_type: aggregateRootType,
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
