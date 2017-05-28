import {
  assert
} from 'chai';

import MemoryEventStorage from '../../src/event/memory_event_storage';

describe('MemoryEventStorage', function () {
  it('可以提交读取数据', function () {
    const store = new MemoryEventStorage();
    let c = store.count();
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

    store.commit();

    c = store.count()
    assert.equal(1, c);

    let item = store.select({
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

  });

  it('支持visit访问', async function () {

    const store = new MemoryEventStorage();

    for (let i = 0; i < 1000; i++) {
      const t = new Date();
      store.insert({
        id: 10000 + i,
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

    store.commit();

    for (let i = 0; i < 1000; i++) {
      const t = new Date();
      store.insert({
        id: 10000 + i,
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
    store.commit();

    assert.equal(store.count(), 2000);

    let c = 0;
    await store.visit({
      module: 'mm'
    },{}, (item) => {
      assert.equal(item.id, 10000 + c);
      c++;
    });

    assert.equal(c, 1000);
  });

  it('支持类似mongodb的表达式', async function () {
    const store = new MemoryEventStorage();
    assert(store.filter({
      key: 100
    }, {
      key: {
        $gt: 99
      }
    }) === true);
    assert(store.filter({
      key: 100
    }, {
      key: {
        $gt: 100
      }
    }) === false);
    assert(store.filter({
      key: 100
    }, {
      key: {
        $gt: 111
      }
    }) === false);

    assert(store.filter({
      key: 66
    }, {
      key: {
        $lt: 77
      }
    }) === true);
    assert(store.filter({
      key: 66
    }, {
      key: {
        $lt: 66
      }
    }) === false);
    assert(store.filter({
      key: 66
    }, {
      key: {
        $lt: 55
      }
    }) === false);

    assert(store.filter({
      key: 'aa'
    }, {
      key: {
        $in: ['a', 'b']
      }
    }) === false);
    assert(store.filter({
      key: 'aa'
    }, {
      key: {
        $in: ['a', 'aa']
      }
    }) === true);
  });

  it('支持排序', async function () {
    const store = new MemoryEventStorage();
    //ASC
    assert(store.sort({
      key: 11
    }, {
      key: 99
    }, {
      key: -1
    })<0);

    assert(store.sort({
      key: 11
    }, {
      key: 11
    }, {
      key: -1
    })==0);

    assert(store.sort({
      key: 22
    }, {
      key: 11
    }, {
      key: -1
    })>0);

// DESC
    assert(store.sort({
      key: 11
    }, {
      key: 99
    }, {
      key: 1
    })>0);

    assert(store.sort({
      key: 11
    }, {
      key: 11
    }, {
      key: -1
    })==0);

    assert(store.sort({
      key: 22
    }, {
      key: 11
    }, {
      key: 1
    })<0);
  });

});
