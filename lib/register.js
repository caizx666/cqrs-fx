'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registry = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.register = register;

var _core = require('./core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registry = exports.registry = {
  eventhandler: {
    // xxxevent: []
  },
  commandhandler: {},
  domain: {}
};

function register() {
  // 注册处理器和domain对象
  _registerHandler('command');
  _registerHandler('event');
  _registerDomain('domain');
}

function _registerDomain(itemType) {
  var domain = registry.domain;
  if (!domain) return;
  for (var _alias in _core.fxData.alias) {
    if (_alias.indexOf('/' + itemType + '/')) domain[_alias] = _alias;
  }
}

function _registerHandler(itemType) {
  var handlers = registry[itemType + 'handler'];
  if (handlers !== null) {
    // 先注册配置文件中定义的handler，配置文件中可以配置其他模块的handler
    for (var _alias2 in _core.fxData.alias) {
      if (_alias2.indexOf('/config/' + itemType + 'handler') == -1) continue;
      var handlerConfig = config.get(itemType + 'handler');
      handlerConfig = merge(handlerConfig, (0, _core.require)(_alias2));
      for (var p in handlerConfig) {
        if (!isString(p)) continue;
        var array = handlers[p] || [];
        var items = handlerConfig[p];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(items), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            if (array.indexOf(item) > -1) continue;
            // 如果handler文件不存在跳过
            if (!_core.fxData.alias[module + '/' + itemType + '/' + item]) continue;
            // 注册
            array.push(item);
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

        handlers[p] = array;
      }
    }
    // 补充默认handler文件夹中的handler
    for (var _alias3 in _core.fxData.alias) {
      if (_alias3.indexOf('/' + itemType + '/') == -1) continue;
      var messageType = _alias3.trimRight('handler');
      var _array = handlers[messageType] || [];
      if (_array.indexOf(_alias3) > -1) return;
      // 要是已经在配置文件中注册，就不注册默认事件
      // 注册
      _array.push(_alias3);
      handlers[messageType] = _array;
    }
  }
}