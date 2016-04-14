'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _idgenerator = require('./idgenerator');

var _idgenerator2 = _interopRequireDefault(_idgenerator);

var _sequence_generator = require('./sequence_generator');

var _sequence_generator2 = _interopRequireDefault(_sequence_generator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var genConfig = _config2.default.get();
exports.default = {
  idgenerator: genConfig.idgenerator === 'idgenerator' ? _idgenerator2.default : typeof genConfig.idgenerator === 'function' ? genConfig.idgenerator : _idgenerator2.default,
  sequence_generator: genConfig.sequence_generator === 'sequence_generator' ? _sequence_generator2.default : typeof genConfig.sequence_generator === 'function' ? genConfig.sequence_generator : _sequence_generator2.default
};