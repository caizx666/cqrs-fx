import {assert} from 'chai';

import MemoryEventStorage from '../../src/event/memory_event_storage';

describe('MemoryEventStorage', function() {
  it('可以提交读取数据', function() {
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

    c =  store.count()
    assert.equal(1, c);

    let item =  store.select({id: 1});
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
});
