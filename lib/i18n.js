'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _i18next = require('i18next');

var _i18next2 = _interopRequireDefault(_i18next);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18next2.default.init({
  lng: 'zh-CN',
  resources: {
    en: {
      translation: require('./locales/en').default
    }
  }
}, function (err, t) {
  // initialized and ready to go!
  //const hw = i18next.t('key'); // hw = 'hello world'
});

exports.default = _i18next2.default;
//# sourceMappingURL=i18n.js.map