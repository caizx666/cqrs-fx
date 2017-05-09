'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEventStorage = getEventStorage;

var _domain_event_storage = require('./domain_event_storage');

var _domain_event_storage2 = _interopRequireDefault(_domain_event_storage);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _err = require('../err');

var _err2 = _interopRequireDefault(_err);

var _i18n = require('../i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventStorage = void 0;

function getEventStorage() {
  var evtConfig = _config2.default.get('event');

  if (eventStorage) {
    return eventStorage;
  }

  var StorageType = typeof evtConfig.storage === 'function' ? evtConfig.storage : 'domain_event';

  var storage = evtConfig.storage == 'domain_event' ? new _domain_event_storage2.default() : StorageType ? StorageType() : null;
  if (!storage) throw Error(_err2.default.configFailed, _i18n2.default.t('事件仓库未正确配置，可以在config/event.js中指定'));

  eventStorage = storage;

  return storage;
}
//# sourceMappingURL=index.js.map