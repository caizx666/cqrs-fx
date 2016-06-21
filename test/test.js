var config = require('../lib/config').default;
var mysql_storage = require('../lib/event/mysql_storage').default;

config.init({
  mysql:{
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'cqrsdb'
  }
});

var s = new mysql_storage();

var result = s.select({
  id: 'aaa',
  name: 'test_event',
  version: 1
});

console.log(result);
