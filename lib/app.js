'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _core = require('./core');

var _register = require('./register');

var _register2 = _interopRequireDefault(_register);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class(options) {
    _classCallCheck(this, _class);

    _config2.default.init(options || {});
    this._modules = [];
    this._types = ['command', 'domain', 'event'];
    this._dirname = {
      app: 'app',
      command: 'command',
      config: 'config',
      event: 'event',
      domain: 'domain'
    };
  }

  _createClass(_class, [{
    key: 'loadSubModule',
    value: function loadSubModule(name) {
      if (!_config2.default.appPath) return;
      var path = (0, _utils.join)(_config2.default.appPath, name);
      if ((0, _utils.isDir)(path)) {
        var dirs = (0, _utils.getDirs)(path);
        if (dirs.length <= 0) return; // 空模块
        var isModule = false;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = dirs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _name = _step.value;

            if (this._types.indexOf(_name) > -1) {
              isModule = true;
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (!isModule) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = dirs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var dir = _step2.value;

              this.loadSubModule((0, _utils.join)(name, dir));
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        } else {
          this._modules.push(name);
        }
      }
    }
  }, {
    key: 'loadModule',
    value: function loadModule() {
      this._modules = [];
      this.loadSubModule('');
    }

    // 加载cqrs

  }, {
    key: 'loadCQRS',
    value: function loadCQRS() {
      var _this = this;

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        var _loop = function _loop() {
          var itemType = _step3.value;

          _this._modules.forEach(function (module) {
            var name = module.replace(/\\/g, '/');
            var moduleType = name + '/' + itemType;
            var filepath = '' + _config2.default.appPath + _utils.sep + module + _utils.sep + _this._dirname[itemType];
            (0, _core.alias)(moduleType, filepath);
            if (itemtype == 'command' || itemtype == 'event') _this._registerHandler(name, itemType, moduletype);
            if (itemtype == 'domain') _this._registerDomain(name, itemType, moduletype);
          });
        };

        for (var _iterator3 = this._types[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: '_registerDomain',
    value: function _registerDomain(name, moduleType) {
      var domain = _register2.default['domain'];
      if (!domain) return;
      _core.fxData.alias.forEach(function (alias) {
        // 当前新加载的类型
        if (!alias.startWith(moduleType)) return;
        // 默认模块下的domain都是处理当前模块下的
        var name = alias.substr(moduleType.length + 1);
        // 当前模块自动追加模块命名空间成fullname
        var fullName = name.replace(/\//g, '_') + '_' + name;
        domain[fullName] = alias;
      });
    }
  }, {
    key: '_registerHandler',
    value: function _registerHandler(name, itemtype, moduletype) {
      var _this2 = this;

      var handlers = _register2.default[itemtype + 'handler'];
      if (handlers != null) {
        (function () {
          handlerConfig = _config2.default.get(itemtype + 'handler', '' + _config2.default.appPath + _utils.sep + module + _utils.sep + _this2._dirname['config']);
          var configtypes = [];
          for (var p in handlerConfig) {
            if (!(0, _utils.isString)(p)) continue;
            var array = handlers[p] || [];
            var items = handlerConfig[p];
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = items[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var item = _step4.value;

                configtypes.push(item);
                if (array.indexOf(item) > -1) continue;
                array.push(item);
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }

            handlers[p] = array;
          }
          _core.fxData.alias.forEach(function (alias) {
            // 当前新加载的类型
            if (!alias.startWith(moduleType)) return;
            // 默认模块下的handler都是处理当前模块下的消息
            var name = alias.substr(moduleType.length + 1);
            // 如果在配置文件里就是其他模块的消息
            if (configtypes.indexOf(name) > -1) return;
            // 当前模块自动追加模块命名空间成fullname
            var fullName = name.replace(/\//g, '_') + '_' + name;
            var array = handlers[fullName] || [];
            if (array.indexOf(alias) > -1) return;
            array.push(alias);
            handlers[fullName] = array;
          });
        })();
      }
    }
  }, {
    key: 'checkEnv',
    value: function checkEnv() {
      if (!(0, _utils.exists)(_config2.default.appPath)) {
        throw 'appPath ' + _config2.default.appPath + ' not found.';
      }
    }
  }, {
    key: 'autoReload',
    value: function autoReload() {
      //it auto reload by watch compile
      if (this.compileCallback) {
        return;
      }
      var instance = this.getReloadInstance();
      instance.run();
    }
  }, {
    key: 'getReloadInstance',
    value: function getReloadInstance(srcPath) {
      var _this3 = this;

      srcPath = srcPath || _config2.default.appPath;
      var instance = new AutoReload(srcPath, function () {
        _this3.clearData();
        _this3.load();
      });
      return instance;
    }
  }, {
    key: 'compile',
    value: function compile(srcPath, outPath) {
      var _this4 = this,
          _arguments = arguments;

      srcPath = srcPath || _config2.default.srcPath;
      outPath = outPath || _config2.default.appPath;
      if ((0, _utils.isDir)(srcPath)) {
        var _len, options, _key;

        (function () {
          var reloadInstance = _this4.getReloadInstance(outPath);
          _this4.compileCallback = function (changedFiles) {
            reloadInstance.clearFilesCache(changedFiles);
          };

          for (_len = _arguments.length, options = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            options[_key - 2] = _arguments[_key];
          }

          var instance = new WatchCompile(srcPath, outPath, options, _this4.compileCallback);
          instance.run();
          console.log('watch ' + srcPath + ' for compile...');
        })();
      }
    }
  }, {
    key: 'clearData',
    value: function clearData() {
      if (this._modules) {
        _core.fxData.alias = {};
        _core.fxData.export = {};
      }
    }
  }, {
    key: 'load',
    value: function load() {
      this.checkEnv();
      this.loadModule();
      this.loadCQRS();
      this.loadApp();
    }
  }, {
    key: 'preload',
    value: function preload() {
      var startTime = Date.now();
      for (var name in _core.fxData.alias) {
        (0, _core.getType)(_core.fxData.alias[name]);
      }
      (0, _utils.log)('cqrs preload packages finished', 'PRELOAD', startTime);
    }
  }, {
    key: 'run',
    value: function run(preload) {
      this.load();
      this.autoReload();
      if (preload) {
        this.preload();
      }
    }
  }]);

  return _class;
}();

exports.default = _class;