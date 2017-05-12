# cqrs-fx

## 概述

定义为一个 Configurable 可配置、Extensible 可扩展、EventSourced 事件溯源、Object-oriented 面向对象 的CQRS框架。

## 安装：

`npm install cqrs-fx --save`

## 常规调用：

`import {App} from 'cqrs-fx';
import path from 'path';

const cqrs = new App({
  appPath: path.join(__dirname, 'demo'),
  mysql:{
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'cqrsdb'
  }
});

cqrs.run();

cqrs.publishCommand('createAccount',
  {
    key1: 1,
    key2: {
      a:'hello',
      b: 28
    }
  });`

** App不要创建多个实例，整个系统都是单例的 **

## 使用：

模块采用面向对象的开发

### 领域对象

`import {Aggregate} from 'cqrs-fx';

export default class Account extends Aggregate {
  userName;
  password;
  displayName;
  email;

}`

`export default class UserAccount extends Account {
  contactPhone;
  contactAddress;

  static create(
    userName,
    password,
    ...others) {
    if (!userName) {
      throw Error('用户名不能为空');
    }
    if (!password || password.length < 5) {
      throw Error('密码不能少于5位');
    }
    let userAccount = new UserAccount();
    userAccount.raiseEvent('created', {
      userName,
      password,
      ...others
    });
    return userAccount;
  }

  when({
    name,
    data
  }) {
    console.log(name, data);
  }

  created({
    contactPhone,
    userName,
    password,
    displayName,
    email,
    ...contactAddress
  }) {
    this.userName = userName;
    this.password = password;
    this.displayName = displayName;
    this.email = email;
    this.contactPhone = contactPhone;
    this.contactAddress = contactAddress;
  }
}

`

### 命令

由name和data组成

`{
  name: 'createAccount',
  data:{
    name: 'xxxx',
    email: 'xxxx'
  }
}`

### 事件

和命令对象雷同

`{
  name: 'accountCreated',
  data:{
    name: 'xxxx',
    email: 'xxxx'
  }
}`

### 处理器

`import {CommandHandler} from 'cqrs-fx';

export default class AccountCommandHandler extends CommandHandler {
  createAccount(message) {
    const userAccount = this.getAggregate('UserAccount').create(message);
    this.repository.save(userAccount);
    this.repository.commit();
    return true;
  }

  deleteAccount(message){
    const userAccount =  this.repository.get('UserAccount');
    userAccount.delete();
    this.repository.save(userAccount);
    this.repository.commit();
    return true;
  }
}`

领域事件订阅

`import {EventHandler} from 'cqrs-fx';

export default class AccountEventHandler extends EventHandler {
  db = mysql;

  createAccount({userName, email}) {
    db.query('insert AccountTable (id, email) values (?userName,?email)', {userName,email});
  }

  deleteAccount({userName}){
    db.query('delete from AccountTable where id = ?userName', {userName})
  }
}`

## 配置性 && 扩展性：

可以通过构造App实例时配置系统

`new App({
  appPath: path.join(__dirname, 'demo'),
  mysql: {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'cqrsdb'
  },
  bus: {
    commandBus: 'direct',
    eventBus: 'mq'
  },
  event: {
    storage: 'domain_event'
  },
  repository: {
    type: 'event_sourced'
  },
  snapshot: {
    provider: 'event_number'
  }
});`

type可以配置为一个对象或加载函数

`new App({
  bus: {
    commandBus: MyCommandBus,
    eventBus: ()=> new MyEventBus({...})
  },
  event: {
    storage: eventBus: ()=> new MyEventStorage({...})
  },
  repository: {
    type: eventBus: ()=> new MyRepository({...})
  },
  snapshot: {
    provider: eventBus: ()=> new MySnapshotProvider({...})
  }
});`
