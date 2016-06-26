'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _core = require('./core');

var _register = require('./register');

var _register2 = _interopRequireDefault(_register);

var _utils = require('./utils');

var _watch_compile = require('./util/watch_compile');

var _watch_compile2 = _interopRequireDefault(_watch_compile);

var _auto_reload = require('./util/auto_reload');

var _auto_reload2 = _interopRequireDefault(_auto_reload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function () {
  function _class(options, loader) {
    (0, _classCallCheck3.default)(this, _class);

    _config2.default.init(options || {});
    this._modules = [];
    this._loader = loader;
    this._types = ['command', 'domain', 'event'];
    this._dirname = {
      command: 'command',
      config: 'config',
      event: 'event',
      domain: 'domain'
    };
  }

  (0, _createClass3.default)(_class, [{
    key: 'loadSubModule',
    value: function loadSubModule(name) {
      var dir = _path2.default.join(_config2.default.appPath, name);
      if ((0, _utils.isDir)(dir)) {
        var dirs = (0, _utils.getDirs)(dir);
        if (dirs.length <= 0) return; // 空模块
        var isModule = false;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(dirs), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
            for (var _iterator2 = (0, _getIterator3.default)(dirs), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _dir = _step2.value;

              this.loadSubModule(_path2.default.join(name, _dir));
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
          });
          // 支持加载扩展对象定义
          _this.loadExts({
            itemType: itemType,
            modules: _this._modules,
            alias: _core.alias
          });
        };

        for (var _iterator3 = (0, _getIterator3.default)(this._types), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          _loop();
        }
        // 注册处理器和domain对象
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

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        var _loop2 = function _loop2() {
          var itemType = _step4.value;

          _this._modules.forEach(function (module) {
            var name = module.replace(/\\/g, '/');
            if (itemType == 'command' || itemType == 'event') _this._registerHandler(name, itemType);
            if (itemType == 'domain') _this._registerDomain(name, itemType);
          });
        };

        for (var _iterator4 = (0, _getIterator3.default)(this._types), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          _loop2();
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
    }
  }, {
    key: 'loadExts',
    value: function loadExts(args) {
      if ((0, _utils.isFunction)(this._loader)) {
        this._loader(args);
      }
    }
  }, {
    key: '_registerDomain',
    value: function _registerDomain(name, itemType) {
      var domain = _register2.default.domain;
      if (!domain) return;
      for (var _alias in _core.fxData.alias) {
        if (_alias.indexOf('/' + itemType + '/')) domain[_alias] = _alias;
      }
    }
  }, {
    key: '_registerHandler',
    value: function _registerHandler(name, itemType) {
      var _this2 = this;

      var handlers = _register2.default[itemType + 'handler'];
      if (handlers !== null) {
        // 先注册配置文件中定义的handler，配置文件中可以配置其他模块的handler
        this._modules.forEach(function (module) {
          var handlerConfig = _config2.default.get(itemType + 'handler', '' + _config2.default.appPath + _utils.sep + module + _utils.sep + _this2._dirname.config);
          for (var p in handlerConfig) {
            if (!(0, _utils.isString)(p)) continue;
            var array = handlers[p] || [];
            var items = handlerConfig[p];
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
              for (var _iterator5 = (0, _getIterator3.default)(items), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var item = _step5.value;

                if (array.indexOf(item) > -1) continue;
                // 如果handler文件不存在跳过
                if (!_core.fxData.alias[module + '/' + itemType + '/' + item]) continue;
                // 注册
                array.push(item);
              }
            } catch (err) {
              _didIteratorError5 = true;
              _iteratorError5 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                  _iterator5.return();
                }
              } finally {
                if (_didIteratorError5) {
                  throw _iteratorError5;
                }
              }
            }

            handlers[p] = array;
          }
        });
        // 补充默认handler文件夹中的handler
        for (var _alias2 in _core.fxData.alias) {
          if (_alias2.indexOf('/' + itemType + '/') == -1) continue;
          var messageType = _alias2.trimRight('handler');
          var array = handlers[messageType] || [];
          if (array.indexOf(_alias2) > -1) return;
          // 要是已经在配置文件中注册，就不注册默认事件

          // 注册
          array.push(_alias2);
          handlers[messageType] = array;
        }
      }
    }
  }, {
    key: 'checkEnv',
    value: function checkEnv() {
      if (!(0, _utils.exists)(_config2.default.appPath)) {
        throw Error('appPath "' + (_config2.default.appPath || '') + '" not found.');
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
      var instance = new _auto_reload2.default(srcPath, function () {
        _this3.clearData();
        _this3.load();
      });
      return instance;
    }
  }, {
    key: 'compile',
    value: function compile(srcPath, outPath) {
      var _this4 = this;

      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      srcPath = srcPath || '' + _config2.default.appPath + _utils.sep + '..' + _utils.sep + 'src';
      outPath = outPath || _config2.default.appPath;
      if ((0, _utils.isDir)(srcPath)) {
        (function () {
          var reloadInstance = _this4.getReloadInstance(outPath);
          _this4.compileCallback = function (changedFiles) {
            reloadInstance.clearFilesCache(changedFiles);
          };
          var instance = new _watch_compile2.default(srcPath, outPath, options, _this4.compileCallback);
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