import {assert} from 'chai';
import EventSourcedRepository from '../../src/repository/event_sourced_repository';
import {fxData} from '../../src/core';
import Aggregate from '../../src/aggregate';
import path from 'path';

describe('事件仓库', function() {
  it('能保存并读取一个聚合对象', function() {
    fxData.alias = {};
    fxData.alias['module1/domain/UserAccount'] = path.normalize(__dirname + '/../../demo/module1/domain/UserAccount.js');

    const rep = new EventSourcedRepository();
    const agg = Aggregate.get('UserAccount').create({userName: 'user1', password: '123456', displayName: '张三'});
    rep.save(agg);
    rep.commit();

    rep.get('UserAccount', agg.id).then(obj => {
      assert(obj.userName == agg.userName);
      assert(obj.password == agg.password);
      assert(obj.displayName == agg.displayName);
    })
  });

});
