cqrs-fx 定义为一个可配置、可扩展、EventSourced、面向对象的CQRS框架。

安装：

npm install cqrs-fx --save


常规调用：

import path from 'path';
import {app} from 'cqrs-fx';

const cqrs = new app({
  appPath: path.join(__dirname, 'demo'),
  mysql:{
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'cqrsdb'
  }
});

cqrs.run();

cqrs.publishCommand({
  name: 'do1',
  data:{
    key1: 1,
    key2: {
      a:'hello',
      b: 28
    }
  }
});

模块代码：


配置性：


扩展性：
