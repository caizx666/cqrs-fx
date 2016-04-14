'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class() {
    _classCallCheck(this, _class);
  }

  _createClass(_class, null, [{
    key: 'init',
    value: function init(options) {
      options = options || {};
      this.rootConfig = __dirname;
      this.configPath = options.configPath;
      this.configCache = {};
      this.initConfig = Object.assign({}, options);
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.configCache = {};
    }
    // 加载三级配置，cqrs->globalconfig->modduleconfig

  }, {
    key: 'get',
    value: function get(name, moduleConfigPath) {
      name = name || 'config';
      if (this.configCache[name]) return this.configCache[name];
      var filename = _path2.default.join(this.rootConfig, name + '.js');
      var json = undefined;
      if (_fs2.default.existsSync(filename)) {
        var str = _fs2.default.readFileSync(filename);
        json = JSON.parse(str);
      } else {
        json = {};
      }
      if (this.configPath) {
        var filename2 = _path2.default.join(this.configPath, name + '.js');
        if (_fs2.default.existsSync(filename2)) {
          var str2 = _fs2.default.readFileSync(filename2);
          var json2 = JSON.parse(str2);
          Object.assign(json, json2);
        }
      }
      if (moduleConfigPath) {
        var filename3 = _path2.default.join(moduleConfigPath, name + '.js');
        if (_fs2.default.existsSync(filename3)) {
          var str3 = _fs2.default.readFileSync(filename3);
          var json3 = JSON.parse(str3);
          Object.assign(json, json3);
        }
      }
      if (this.initConfig && this.initConfig[name]) {
        Object.assign(json, this.initConfig[name]);
      }
      this.configCache[name] = json;
      return json;
    }
  }]);

  return _class;
}();

exports.default = _class;