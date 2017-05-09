'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProvider = getProvider;

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _err = require('../err');

var _err2 = _interopRequireDefault(_err);

var _i18n = require('../i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var provider = void 0;

function getProvider() {
  if (provider) {
    return provider;
  }

  provider = require('./' + (_config2.default.get('snapshot').provider || 'event_number') + '_provider');
  if (!provider) throw Error(_err2.default.configFailed, _i18n2.default.t('快照提供服务未正确配置，可以在config/snapshot.js中指定'));
}
//# sourceMappingURL=index.js.map