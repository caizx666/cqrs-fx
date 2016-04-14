var assert = require('chai').assert;

var config = require('../../lib/config');
var mysql_storage = require('../../lib/event/mysql_storage');

config.init({
  mysql:{
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'cqrsdb'
  }
});

describe('event', function() {
  describe('mysql_storage', function () {
    it('select mysql', function () {
      var s = new mysql_storage();
      s.select({
        id: 'aaa',
        name: 'test_event',
        version: 1
      });
    });
  });
});
