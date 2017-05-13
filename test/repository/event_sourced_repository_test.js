import {assert} from 'chai';
import EventSourcedRepository from '../../src/repository/event_sourced_repository';
import {fxData} from '../../src/core';
import Aggregate from '../../src/aggregate';
import path from 'path';
import config from '../../src/config';

config.init({
  bus: {
    commandBus: 'direct',
    eventBus: 'direct'
  },
  event: {
    storage: 'memory_domain_event'
  },
  snapshot: {
    storage: 'memory',
    numberOfEvents: 2
  }
});

describe('事件仓库', function() {
  it('能保存并读取一个聚合对象', async function() {
    fxData.alias = {};
    fxData.alias['module1/domain/UserAccount'] = path.normalize(__dirname + '/../../demo/module1/domain/UserAccount.js');

    const rep = new EventSourcedRepository();
    const agg = Aggregate.get('module1/UserAccount').create({userName: 'user1', password: '123456', displayName: '张三'});
    //  console.log(agg)
    rep.save(agg);
    await rep.commit();

    const obj = await rep.get('module1/UserAccount', agg.id);
    assert(obj);
  //  console.log(obj)
    assert.equal(obj.userName, agg.userName);
    assert.equal(obj.password, agg.password);
    assert.equal(obj.displayName, agg.displayName);

  });

  it('可以保存快照并恢复状态', async function() {
    fxData.alias = {};
    fxData.alias['module1/domain/UserAccount'] = path.normalize(__dirname + '/../../demo/module1/domain/UserAccount.js');

    const rep = new EventSourcedRepository();
    const agg = Aggregate.get('module1/UserAccount').create({userName: 'user1', password: '123456', displayName: '张三'});

    agg.updateAddress('地址1');
    agg.updateEmail('email1');

    agg.updateAddress('地址2');
    agg.updateEmail('email2');

    rep.save(agg);

    await rep.commit();

    const obj = await rep.get('module1/UserAccount', agg.id);
    assert.equal(obj.userName, agg.userName);
    assert.equal(obj.contactAddress, '地址2');
    assert.equal(obj.email, 'email2');

    obj.updateAddress('地址1');
    obj.updateEmail('email1');

    rep.save(obj);
    await rep.commit();

    const obj2 = await rep.get('module1/UserAccount', agg.id);
    assert.equal(obj2.userName, agg.userName);
    assert.equal(obj2.contactAddress, '地址1');
    assert.equal(obj2.email, 'email1');

  });
});
