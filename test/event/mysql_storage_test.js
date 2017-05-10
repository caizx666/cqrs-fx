var assert = require('chai').assert;

import config from '../../src/config';
import MysqlStorage from '../../src/event/mysql_storage';

config.init({
  mysql:{
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'cqrsdb'
  }
});

describe('事件', function() {
  describe('mysql数据存储服务', function () {
    it('可以查询', function () {
      var s = new MysqlStorage();
      assert(s.select({
        id: 'aaa',
        name: 'test_event',
        version: 1
      }));
    });
  });
});
