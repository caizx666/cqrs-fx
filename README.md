# cqrs-fx

## 概述

定义为一个 Configurable 可配置、Extensible 可扩展、EventSourced 事件溯源、Object-oriented 面向对象 的CQRS框架。

Introduction to CQRS
https://www.codeproject.com/Articles/555855/Introduction-to-CQRS

## 安装：

```
npm install cqrs-fx --save
```

## 使用：

```js
import {App} from 'cqrs-fx';
import path from 'path';

const cqrs = new App({
  appPath: path.join(__dirname, 'demo'),
  mongo:{
    url: 'mongodb://localhost:27017/cqrs'
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
  });
```

** App不要创建多个实例，整个系统都是单例的 **

## 使用：

模块采用面向对象的开发

### 领域对象

```js
import {Aggregate} from 'cqrs-fx';

export default class Account extends Aggregate {
  userName;
  password;
  displayName;
  email;

}

export default class UserAccount extends Account {
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

```

### 命令

由name和data组成

```js
{
  name: 'createAccount',
  data:{
    name: 'xxxx',
    email: 'xxxx'
  }
}
```

### 事件

和命令对象雷同

```js
{
  name: 'accountCreated',
  data:{
    name: 'xxxx',
    email: 'xxxx'
  }
}
```

### 命令执行Handler

```js
import {CommandHandler} from 'cqrs-fx';

export default class AccountCommandHandler extends CommandHandler {
  async createAccount(message) {
    this.repository.use(async() => {
      const userAccount = this.getAggregate('UserAccount').create(message);
      await this.repository.save(userAccount);
      await this.repository.commit();
    });
  }

  deleteAccount(message) {
    this.repository.use(() => {
        const userAccount = this.repository.get('UserAccount');
        userAccount.delete();
        this.repository.save(userAccount);
        this.repository.commit();
      }
    }
  }
```

### 业务事件的Handler

```js
import {EventHandler} from 'cqrs-fx';

export default class AccountEventHandler extends EventHandler {
  db = mysql;

  accountCreated({userName, email}) {
    db.query('insert AccountTable (id, email) values (?userName,?email)', {userName,email});
  }

  accountDeleted({userName}){
    db.query('delete from AccountTable where id = ?userName', {userName})
  }
}
```

## 配置性 && 扩展性：

可以通过构造App实例时配置系统

```js
new App({
  appPath: path.join(__dirname, 'demo'),
  bus: {
    commandBus: 'direct',
    eventBus: 'mq'  
    dispatcher: 'message_dipatcher'
  },
  event: {
    storage: 'mongo_domain_event'
    collection: 'events',
    mongo:{
      ...
    },
    mysql:{
      ...
    },
    redis:{
      ...
    }
  },
  repository: {
    type: 'event_sourced'
  },
  snapshot: {
    provider: 'event_number',
    storage: 'mongo',  // redis mysql mongo ...
    collection: 'snapshots',
    // immediate: Indicates that immediate snapshot create/update should be performed.
    // postpone: Indicates that the creating/updating of the snapshots  would be postponed to a later scenario.
    option: 'immediate',
    // 快照的保存周期，默认每100个事件保存一次快照
    numberOfEvents: 100,
    mongo:{
      ...
    },
    mysql:{
      ...
    },
    redis:{
      ...
    }
  },
  mongo:{
    url: 'mongodb://localhost:27017/cqrs'
  },
  mysql: {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'cqrsdb'
  },
  redis:{
    host: "127.0.0.1",
    port: 6379,
    password: "",
    timeout: 0
  }
});
```

可以配置为一个对象或加载函数

```js
new App({
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
});
```

## 快照

默认保存所有非跟对象属性，但是可以重写

```js
export default class AdminAccount extends Account {
  ...

  doCreateSnapshot() {
    return {userName: this.userName, password: this.password, displayName: this.displayName, email: this.email};
  }

  doBuildFromSnapshot({userName, password, displayName, email}) {
    this.userName = userName;
    this.password = password;
    this.displayName = displayName;
    this.email = email;
    this.isAdmin = true;
  }
}
```
