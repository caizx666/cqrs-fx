'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new (function () {
  function _class() {
    (0, _classCallCheck3.default)(this, _class);

    this.rootConfig = __dirname;
    this.configCache = {};
  }

  (0, _createClass3.default)(_class, [{
    key: 'init',
    value: function init(options) {
      options = options || {};
      this.configPath = options.configPath;
      this.initConfig = (0, _assign2.default)({}, options);
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
      var filename = this.rootConfig + _utils.sep + name + '.js';
      var json = (0, _utils.safeRequire)(filename) || {};
      if (this.configPath) {
        var filename2 = this.configPath + _utils.sep + name + '.js';
        if ((0, _utils.exists)(filename2)) {
          var json2 = (0, _utils.safeRequire)(filename2);
          (0, _assign2.default)(json, json2);
        }
      }
      if (moduleConfigPath) {
        var filename3 = moduleConfigPath + _utils.sep + name + '.js';
        if ((0, _utils.exists)(filename3)) {
          var json3 = (0, _utils.safeRequire)(filename3);
          (0, _assign2.default)(json, json3);
        }
      }
      if (this.initConfig && this.initConfig[name]) {
        (0, _assign2.default)(json, this.initConfig[name]);
      }
      this.configCache[name] = json;
      return json;
    }
  }]);
  return _class;
}())();