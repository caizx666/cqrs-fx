'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _err = require('../err');

var _err2 = _interopRequireDefault(_err);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var provider = require('./' + (_config2.default.get('snapshot').provider || 'event_number') + '_provider');
if (!provider) throw Error(_err2.default.configFailed, '快照提供服务未正确配置，可以在config/snapshot.js中指定');

exports.default = {
  provider: provider
};