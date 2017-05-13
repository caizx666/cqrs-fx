import redis from "redis";
import {
  log
} from '../utils';
import config from '../config';
import SnapshotStorage from './snapshot_storage';

export default class RedisSnapshotStorage extends SnapshotStorage {
  constructor() {
    super();
    let redisConfig = config.get('redis');
    this._password = redisConfig.password;
    this._hkey = 'cqrs_snapshot';
    this._client = redis.createClient(redisConfig);
    this._client.on("error", function (err) {
      log("Error " + err);
    });
  }

  count(spec) {
    return new Promise(function (resolve, reject) {
      this._client.hkeys(this._hkey, function (err, replies) {
        if (err) reject(err);
        resolve(replies.length);
      });
    });
  }

  // select first
  first(spec) {

  }


  commit() {
    let _commit = function functionName() {

    };
    if (this._password) {
      this._client.auth(this._password, function () {

      });
    } else {

    }
  }


}
