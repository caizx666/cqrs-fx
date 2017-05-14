import {assert} from 'chai';
import path from 'path';
import {Aggregate} from '../src';
import {fxData} from '../src/core';

describe('Aggregate', function() {
  it('加载并创建一个对象实例', function() {
    fxData.alias = {};
    fxData.alias['module1/domain/UserAccount'] = path.normalize(__dirname + '/../demo/module1/domain/UserAccount.js');

    const UserAccount2 = Aggregate.get('module1/UserAccount');
    assert(UserAccount2);

    const UserAccount = Aggregate.get('UserAccount', 'module1');
    assert(UserAccount);
    const user = UserAccount.create({userName: 'user1', password: '123456', displayName: '张三'});
    assert(user);
    assert.equal(user.userName, 'user1');
    assert.equal(user.password, '123456');
    assert.equal(user.displayName, '张三');
  });

  it('创建快照并从快照中恢复', function() {
    fxData.alias = {};
    fxData.alias['module1/domain/AdminAccount'] = path.normalize(__dirname + '/../demo/module1/domain/AdminAccount.js');
    fxData.alias['module1/domain/UserAccount'] = path.normalize(__dirname + '/../demo/module1/domain/UserAccount.js');

    const UserAccount = Aggregate.get('UserAccount', 'module1');
    const user = UserAccount.create({userName: 'user1', password: '123456', displayName: '张三'});

    assert.equal(user.userName, 'user1');
    assert.equal(user.password, '123456');
    assert.equal(user.displayName, '张三');

    const sp = user.createSnapshot();

    assert(!sp._domainEventHandlers);

    assert.equal(sp.userName, 'user1');
    assert.equal(sp.password, '123456');
    assert.equal(sp.displayName, '张三');

    const user2 = new UserAccount;
    user2.buildFromSnapshot(sp);

    assert.equal(user2.userName, 'user1');
    assert.equal(user2.password, '123456');
    assert.equal(user2.displayName, '张三');

    const AdminAccount = Aggregate.get('AdminAccount', 'module1');
    const user3 = AdminAccount.create({userName: 'user2', password: '123456', displayName: '王二麻子'});

    assert.equal(user3.userName, 'user2');
    assert.equal(user3.password, '123456');
    assert.equal(user3.displayName, '王二麻子');

    const sp3 = user3.createSnapshot();

    assert.equal(sp3.userName, 'user2');
    assert.equal(sp3.password, '123456');
    assert.equal(sp3.displayName, '王二麻子');

    debugger
    const user4 = new AdminAccount();
    user4.buildFromSnapshot(sp3);

    assert.equal(user4.userName, 'user2');
    assert.equal(user4.password, '123456');
    assert.equal(user4.displayName, '王二麻子');
  });

  it('可以在历史事件中溯源', function() {
    fxData.alias = {};
    fxData.alias['module1/domain/UserAccount'] = path.normalize(__dirname + '/../demo/module1/domain/UserAccount.js');

    const UserAccount = Aggregate.get('UserAccount', 'module1');
    const user = UserAccount.create({userName: 'user1', password: '123456', displayName: '张三'});
    const events = user.uncommittedEvents;

    const newuser = new UserAccount();
    newuser.buildFromHistory(...events);

    assert.equal(newuser.userName, 'user1');
    assert.equal(newuser.password, '123456');
    assert.equal(newuser.displayName, '张三');
  });
});
