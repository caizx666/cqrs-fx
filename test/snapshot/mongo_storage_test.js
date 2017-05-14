import {assert} from 'chai';

import config from '../../src/config';
import MongoSnapshotStorage from '../../src/snapshot/mongo_snapshot_storage';



describe('MongoSnapshotStorage', function() {
  it('快照可以存储到mongodb中并读取', async function() {
    config.init({
      snapshot: {
        collection: 'snapshots',
        mongo: {
          url: 'mongodb://localhost:27017/test'
        }
      }
    });
    const store = new MongoSnapshotStorage();

    await store.drop();

    let c = await store.count();
    assert.equal(c, 0);

    const t = new Date().getTime();
    store.insert({
      id: 1,
      aggregate_root_type: 'xxxxxxxxxxxxxxxxxxxx',
      aggregate_root_id: '1000222-sssssss-eeee-fffffe-333-444',
      timestamp: t,
      branch: 0,
      version: 199,
      data: {
        a: 100,
        b: 'aaaaaaaaaaaaaaaaaaaaaa'
      }
    });

    store.insert({
      id: 2,
      aggregate_root_type: '3333333333333',
      aggregate_root_id: '1000222-sssssss-eeee-fffffe-333-444',
      timestamp: t,
      branch: 0,
      version: 199,
      data: {
        a: 100,
        b: 'aaaaaaaaaaaaaaaaaaaaaa'
      }
    });

    await store.commit();

    assert.equal(store._actionList.length,0);

    c = await store.count()
    assert.equal(2, c);

    let item = await store.first({id: 1});
    assert(item);

    assert.equal(item.id, 1);
    assert.equal(item.aggregate_root_type, 'xxxxxxxxxxxxxxxxxxxx');
    assert.equal(item.aggregate_root_id, '1000222-sssssss-eeee-fffffe-333-444');
    assert.equal(item.timestamp, t);
    assert.equal(item.branch, 0);
    assert.equal(item.version, 199);

    assert(item.data);

    assert.equal(item.data.a, 100);
    assert.equal(item.data.b, 'aaaaaaaaaaaaaaaaaaaaaa');

    store.update({
      aggregate_root_type: 'xxxxxxxxxxxxxxxxxxxx',
      aggregate_root_id: 'noid',
      timestamp: t,
      branch: 0,
      version: 199,
      data: {
        a: 10011,
        b: ''
      }
    }, {id: 2});

    await store.commit();

    item = await store.first({id: 2});
    assert(item);
    assert.equal(item.data.a, 10011);

    await store.drop();
  });
});
