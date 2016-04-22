var path = require('path');
var cqrs = require('../lib');

var rootpath = __dirname;

var appfx = new cqrs.app({
  configPath: rootPath + path.sep + 'config',
  srcPath: rootPath + path.sep + 'src'
});

//compile src/ to app/
appfx.compile({
  log: true
});

// cqrs
appfx.run();
