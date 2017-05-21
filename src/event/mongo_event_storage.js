import {MongoClient} from 'mongodb';
import config from '../config';
import {expr} from '../utils';
import EventStorage from './event_storage';
import assert from 'assert';

export default class MySqlEventStorage extends EventStorage {
  constructor() {
    super();
    this.collection = config.get('event').collection;
    assert(this.collection);
    const {
      url,
      ...options
    } = {
      ...config.get('mongo'),
      ...config.get('event').mongo
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
    return await db.collection(this.collection).count(spec);
  }
 

  async select({
    id,
    ...other
  }) {
    const db = await this.connect();
    try {
      // 由小到大排序
      return (await db.collection(this.collection).find({
        _id: id,
        ...other
      }).sort({version: 1}).toArray()).map(({
        _id,
        ...other
      }) => ({
        id: _id,
        ...other
      }));
    } finally {
      db.close();
    }
  }

  async commit() {
    const db = await this.connect();
    try {
      await db.collection(this.collection).insertMany(this._addList.map(({
        id,
        ...other
      }) => ({
        _id: id,
        ...other
      })));
      this._addList.length = 0;
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
