import {assert} from 'chai';

import config from '../../src/config';
import MongoEventStorage from '../../src/event/mongo_event_storage';
import {MongoClient} from 'mongodb';

config.init({
  event: {
    collection: 'events',
    mongo: {
      url: 'mongodb://localhost:27017/test'
    }
  }
});

describe('业务事件', function() {
  it('事件可以存储到mongodb中并读取', async function() {
    const store = new MongoEventStorage();
    await store.drop();

    let c = await store.count();
    assert.equal(c, 0);

    const t = new Date().getTime();
    store.insert({
      id: 1,
      eventname: 'xxxx',
      eventid: 100022,
      sourceid: '1000222-sssssss-eeee-fffffe-333-444',
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

    let item = await store.select({id: 1});
    assert.equal(item.length, 1);

    item = item[0];
    assert(item);

    assert.equal(item.id, 1);
    assert.equal(item.eventname, 'xxxx');
    assert.equal(item.eventid, 100022);
    assert.equal(item.sourceid, '1000222-sssssss-eeee-fffffe-333-444');
    assert.equal(item.timestamp, t);
    assert.equal(item.branch, 0);
    assert.equal(item.version, 199);

    assert(item.data);

    assert.equal(item.data.a, 100);
    assert.equal(item.data.b, 'aaaaaaaaaaaaaaaaaaaaaa');

    await store.drop();
   
  });
});