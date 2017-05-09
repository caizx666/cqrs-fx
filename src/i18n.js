import i18next from 'i18next';

i18next.init({
  lng: 'zh-CN',
  resources: {
    en: {
      translation: require('./locales/en').default
    }
  }
}, (err, t) => {
  // initialized and ready to go!
  //const hw = i18next.t('key'); // hw = 'hello world'
});

export default i18next;
