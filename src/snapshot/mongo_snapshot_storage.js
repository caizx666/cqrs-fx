import {MongoClient} from 'mongodb';
import config from '../config';
import SnapshotStorage from './snapshot_storage';
import assert from 'assert';

export default class MongoSnapshotStorage extends SnapshotStorage {
  constructor() {
    super();
    this.collection = config.get('snapshot').collection;
    assert(this.collection);
    const {
      url,
      ...options
    } = {
      ...config.get('mongo'),
      ...config.get('snapshot').mongo
    };
    this.url = url;
    this.options = options;
  }

  async connect() {
    const db = await MongoClient.connect(this.url, this.options);
    if (!this.exists) {
      const collections = await db.collections();
      if (collections.indexOf(this.collection) == -1) {
        const collection = await db.createCollection(this.collection);
        collection.createIndex({version: 1});
      }
      this.exists = true;
    }
    return db;
  }

  async count(spec) {
    const db = await this.connect();
    try {
      return await db.collection(this.collection).count(spec);
    } finally {
      db.close();
    }
  }

  async first({
    id,
    ...other
  }) {
    const db = await this.connect();
    try {
      // 由小到大排序
      const result = await db.collection(this.collection).findOne({
        _id: id,
        ...other
      }, {
        sort: {
          version: 1
        }
      });
      if (!result) {
        return null;
      }
      let {
        _id,
        ...other
      } = result;
      return {
        id: _id,
        ...other
      };
    } finally {
      db.close();
    }
  }

  async commit() {
    const db = await this.connect();
    try {
      const collection = db.collection(this.collection);
      const inserts = this._actionList.filter(item => item.action == 0);
      if (inserts.length > 0) {
        await collection.insertMany(inserts.map(({data}) => {
          let {
            id,
            ...other
          } = data;
          return {
            _id: id,
            ...other
          };
        }));
      }
      this._actionList.filter(item => item.action == 1).forEach(async({data, spec}) => {
        console.log(spec)
        await collection.updateOne({
          _id: spec.id
        }, {$set: data});
      });
      this._actionList.length = 0;
    } finally {
      db.close();
    }
  }

  async drop() {
    const db = await this.connect();
    try {
      await db.dropCollection(this.collection);
    } finally {
      db.close();
    }
  }
}
