'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRepository = getRepository;

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _err = require('../err');

var _err2 = _interopRequireDefault(_err);

var _i18n = require('../i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var repository = void 0;

function getRepository() {
  if (repository) {
    return repository;
  }

  repository = _config2.default.get('repository').type ? require('./' + _config2.default.get('repository').type + '_repository') : null;

  if (!repository) throw Error(_err2.default.configFailed, _i18n2.default.t('领域仓库未正确配置，可以在config/repository.js中指定'));

  return repository;
};
//# sourceMappingURL=index.js.map