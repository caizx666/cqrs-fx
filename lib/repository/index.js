'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _err = require('../err');

var _err2 = _interopRequireDefault(_err);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var repository = _config2.default.get('repository').type ? require('./' + _config2.default.get('repository').type + '_repository') : null;

if (!repository) throw Error(_err2.default.configFailed, '领域仓库未正确配置，可以在config/repository.js中指定');

exports.default = {
  repository: repository
};