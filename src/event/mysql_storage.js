import config from '../config';
import {
  expr
} from '../utils';
import {
  pool as db
} from '../storage/mysql';

export default class {
  constructor() {
    this._tableName = config.get('event').table;
    this._addList = [];
  }

  count(spec) {
    return new Promise(function (resolve, reject) {
      db.query('select count(*) from ?? where ?? ', [this._tableName, expr(spec)], function (err, result) {
        if (err) reject(err);
        resolve(result[0][0]);
      });
    });
  }

  select(spec) {
    return new Promise(function (resolve, reject) {
      db.query('select name,id,data,timestamp from ?? where ?? order by version asc ', [this._tableName, expr(spec)], function (err, rows, fields) {
        if (err) reject(err);
        resolve(rows, fields);
      });
    });
  }

  inert(dto) {
    this._addList.push(dto);
  }

  commit() {
    return new Promise(function (resolve, reject) {
      db.getConnection(function (err, connection) {
        connection.beginTransaction(function (err) {
          if (err) reject(err);
          let count = this._addList.length;
          this._addList.forEach(function (spec) {
            connection.query('inert in to ?? (id, event_type,event_id,source_id,data,version,branch,timestamp) values (?,?,?,?,?,?,?)', [this._tableName, spec.id, spec.eventType, spec.eventid, spec.sourceid, spec.data,
              spec.version, spec.branch, spec.timestamp
            ], function (err) {
              if (err) {
                return connection.rollback(function () {
                  connection.release();
                  reject(err);
                });
              }
              count--;
              if (count === 0) {
                this._addList.clear();
                connection.commit(function (err) {
                  connection.release();
                  if (err) reject(err);
                  log('保存领域事件完成');
                  resolve();
                });
              }
            });
          });
        });
      });
    });
  }

  rollback() {
    this._addList.clear();
  }
}
