'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

exports.default = new (function () {
  function _class(options) {
    _classCallCheck(this, _class);

    options = options || {};
    this.rootConfig = __dirname;
    this.configPath = options.configPath;
    this.configCache = {};
    this.initConfig = Object.assign({}, options);
  }

  _createClass(_class, [{
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
      var filename = this.rootConfig + _utils.seq + name + '.js';
      var json = (0, _utils.safeRequire)(filename) || {};
      if (this.configPath) {
        var filename2 = this.configPath + _utils.seq + name + '.js';
        if ((0, _utils.exists)(filename2)) {
          var json2 = (0, _utils.safeRequire)(filename2);
          Object.assign(json, json2);
        }
      }
      if (moduleConfigPath) {
        var filename3 = moduleConfigPath + _utils.seq + name + '.js';
        if ((0, _utils.exists)(filename3)) {
          var json3 = (0, _utils.safeRequire)(filename3);
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
}())();