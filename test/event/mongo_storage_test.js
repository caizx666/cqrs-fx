import {
  assert
} from 'chai';

import config from '../../src/config';
import MongoEventStorage from '../../src/event/mongo_event_storage';
import {
  MongoClient
} from 'mongodb';

describe('MongoEventStorage', function () {
  it('事件可以存储到mongodb中并读取', async function () {
    config.init({
      event: {
        collection: 'events',
        mongo: {
          url: 'mongodb://localhost:27017/test'
        }
      }
    });

    const store = new MongoEventStorage();
    await store.drop();

    let c = await store.count();
    assert.equal(c, 0);

    const t = new Date().getTime();
    store.insert({
      id: 1,
      name: 'xxxx',
      module: 'mm',
      source_type: 'aaa/bbb/ccc',
      source_id: '1000222-sssssss-eeee-fffffe-333-444',
      timestamp: t,
      branch: 0,
      version: 199,
      data: {
        a: 100,
        b: 'aaaaaaaaaaaaaaaaaaaaaa'
      }
    });

    await store.commit();

    c = await store.count()
    assert.equal(1, c);

    let item = await store.select({
      id: 1
    });
    assert.equal(item.length, 1);

    item = item[0];
    assert(item);

    assert.equal(item.id, 1);
    assert.equal(item.name, 'xxxx');
    assert.equal(item.source_type, 'aaa/bbb/ccc');
    assert.equal(item.source_id, '1000222-sssssss-eeee-fffffe-333-444');
    assert.equal(item.timestamp, t);
    assert.equal(item.branch, 0);
    assert.equal(item.version, 199);

    assert(item.data);

    assert.equal(item.data.a, 100);
    assert.equal(item.data.b, 'aaaaaaaaaaaaaaaaaaaaaa');

    await store.drop();

  });

  it('支持visit访问大数据', async function () {
    config.init({
      event: {
        collection: 'events',
        mongo: {
          url: 'mongodb://localhost:27017/test'
        }
      }
    });

    const store = new MongoEventStorage();
    await store.drop();

    for (let i = 0; i < 1000; i++) {
      const t = new Date();
      store.insert({
        id: i,
        name: 'xxxx',
        module: 'mm',
        source_type: 'aaa/bbb/ccc',
        source_id: '1000222-sssssss-eeee-fffffe-333-444',
        timestamp: t,
        branch: 0,
        version: 199,
        data: {
          a: 100,
          b: 'aaaaaaaaaaaaaaaaaaaaaa'
        }
      });
    }

    await store.commit();

    for (let i = 0; i < 1000; i++) {
      const t = new Date();
      store.insert({
        id: 10000+i,
        name: 'xxxx',
        module: 'mm2',
        source_type: 'aaa/bbb/ccc',
        source_id: '1000222-sssssss-eeee-fffffe-333-444',
        timestamp: t,
        branch: 0,
        version: 199,
        data: {
          a: 100,
          b: 'aaaaaaaaaaaaaaaaaaaaaa'
        }
      });
    }
    await store.commit();

    assert.equal(await store.count(), 2000);

    let c = 0;
    await store.visit({
      module: 'mm'
    }, {}, (item) => {
      assert.equal(item.id, c);
      c++;
    });

    await store.drop();

  assert.equal(c, 1000);
  });
});
