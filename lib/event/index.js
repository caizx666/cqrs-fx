'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _domain_event_storage = require('./domain_event_storage');

var _domain_event_storage2 = _interopRequireDefault(_domain_event_storage);

var _json_serializer = require('./json_serializer');

var _json_serializer2 = _interopRequireDefault(_json_serializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storage = config.get('event').storage == 'default' ? _domain_event_storage2.default : null;
if (!storage) throw { code: err.configFailed, msg: '事件仓库未正确配置，可以在config/event.js中指定' };

var serializer = config.get('event').serializer == 'default' ? _json_serializer2.default : null;
if (!serializer) throw { code: err.configFailed, msg: '事件序列化服务未正确配置，可以在config/snapshot.js中指定' };

exports.default = {
  storage: storage,
  serializer: serializer
};