import config from '../config';
import {
  expr
} from '../utils';
import {
  pool as db
} from '../storage/mysql';
import SnapshotStorage from './snapshot_storage';

export default class MySqlSnapshotStorage extends SnapshotStorage {
  constructor() {
    super();
    this._tableName = config.get('snapshot').table;
    this._actionList = [];
  }

  count(spec) {
    return new Promise(function (resolve, reject) {
      db.query('select count(*) from ?? where ??', [this._tableName, expr(spec)], function (err, result) {
        if (err) reject(err);
        resolve(result[0][0]);
      });
    });
  }

  first(spec) {
    return new Promise(function (resolve, reject) {
      db.query('select id,aggregate_root_type,aggregate_root_id,data,version,branch,timestamp from ?? where ?? order by version asc ', [this._tableName, expr(spec)], function (err, ...result) {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  inert(dto) {
    this._actionList.push({
      action: 0,
      data: dto
    });
  }

  update(dto, spec) {
    this._actionList.push({
      action: 1,
      data: dto,
      spec
    });
  }

  commit() {
    let list = this._actionList.slice(0);
    let count = list.length;
    let checkCommit = (connection, resolve, reject) => {
      if (err) {
        return connection.rollback(function () {
          connection.release();
          reject(err);
        });
      }
      count--;
      if (count === 0) {
        connection.commit(function (err) {
          connection.release();
          if (err) reject(err);
          log('保存快照完成');

          let s = 0;
          for (let i = 0, l = this._actionList.length; i < l; i++) {
            if (this._actionList[i] == list[0]) {
              s = i;
              break;
            }
          }
          this._actionList.splice(i, list.length);
          resolve();
        });
      }
    };
    return new Promise(function (resolve, reject) {
      if (count <= 0) {
        resolve();
        return;
      }
      db.getConnection(function (err, connection) {
        connection.beginTransaction(function (err) {
          if (err) reject(err);
          list.forEach(function (item) {
            if (item.action == 1) {
              connection.query('update ?? data,version,branch,timestamp values (?,?,?,?) where ??', [this._tableName, spec.data, spec.version, spec.branch, spec.timestamp, expr(item.spec)], function (err) {
                checkCommit(connection, resolve, reject);
              });
            }
            if (item.action === 0) {
              connection.query('inert into ?? (id,aggregate_root_type,aggregate_root_id,data,version,branch,timestamp) values (?,?,?,?,?,?,?)', [this._tableName, spec.id, spec.aggregateRootType, spec.aggregateRootID,
                spec.data, spec.version, spec.branch, spec.timestamp
              ], function (err) {
                checkCommit(connection, resolve, reject);
              });
            }
          });
        });
      });
    });
  }

  rollback() {
    this._actionList.clear();
  }
}
