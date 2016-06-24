'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _domain_event_storage = require('./domain_event_storage');

var _domain_event_storage2 = _interopRequireDefault(_domain_event_storage);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _err = require('../err');

var _err2 = _interopRequireDefault(_err);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var evtConfig = _config2.default.get('event');

var StorageType = typeof evtConfig.storage === 'function' ? evtConfig.storage : null;

var storage = evtConfig.storage == 'default' ? new _domain_event_storage2.default() : StorageType ? new StorageType() : null;
if (!storage) throw {
  code: _err2.default.configFailed,
  msg: '事件仓库未正确配置，可以在config/event.js中指定'
};

exports.default = {
  storage: storage
};