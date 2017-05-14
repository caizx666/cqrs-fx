import {assert} from 'chai';

import MemorySnapshotStorage from '../../src/snapshot/memory_snapshot_storage';


describe('MemorySnapshotStorage', function() {
  it('快照可以存储到内存中并读取',  function() {
    const store = new MemorySnapshotStorage();

    let c =  store.count();
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

     store.commit();

    assert.equal(store._actionList.length,0);

    c =  store.count()
    assert.equal(2, c);

    let item =  store.first({id: 1});
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

     store.commit();

    item =  store.first({id: 2});
    assert(item);
    assert.equal(item.data.a, 10011);


  });
});
