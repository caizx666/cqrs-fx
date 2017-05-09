'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _err = require('../err');

var _err2 = _interopRequireDefault(_err);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = create = function create() {
  var storageConfig = _config2.default.get('storage');
  if (storageConfig.type === 'mysql') {
    return new require('./mysql').default(storageConfig.db);
  } else {
    throw Error(_err2.default.configFailed, '存储仓库未正确配置，可以在config/storage.js中指定');
  }
};
//# sourceMappingURL=index.js.map