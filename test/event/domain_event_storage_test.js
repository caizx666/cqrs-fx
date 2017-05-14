import {assert} from 'chai';

import DomainEventStorage from '../../src/event/domain_event_storage';
import MemoryEventStorage from '../../src/event/memory_event_storage';

describe('DomainEventStorage', function() {
  it('可以保存加载领域事件', async function() {
    const store = new DomainEventStorage(new MemoryEventStorage());

    await store.saveEvent({
      id: 111,
      name: 'aaaaaaaaa',
      module: 'mm',
      sourceId: 3343434,
      sourceAlias: 'a/domain/c',
      data: {},
      timestamp: 334343466,
      branch: 0,
      version: 121
    });

    await store.saveEvent({
      id: 113,
      module: 'mm',
      name: 'aaaaaaaaa',
      sourceId: 3343434,
      sourceAlias: 'a/domain/c',
      data: {
        a: 10
      },
      timestamp: 3333435454,
      branch: 0,
      version: 222
    });
    debugger
    await store.commit();

    assert.equal(await store.count(), 2);

    let events = await store.loadEvents('a/domain/c', 3343434);
    assert(events);
    assert.equal(events.length, 2);

    assert.equal(events[0].id, 111);
    assert.equal(events[0].name, 'aaaaaaaaa');
    assert.equal(events[0].timestamp, 334343466);

    assert.equal(events[1].id, 113);
    assert.equal(events[1].name, 'aaaaaaaaa');
    assert.equal(events[1].timestamp, 3333435454);

    events = await store.loadEvents('a/domain/c', 3343434, 220);
    assert(events);
    assert.equal(events.length, 1);

    assert.equal(events[0].id, 111);
    assert.equal(events[0].version, 121);
  });
});
