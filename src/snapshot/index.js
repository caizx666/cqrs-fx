import config from '../config';
import err from '../err';
import i18n from '../i18n';

let provider;

export function getProvider() {
  if (provider) {
    return provider;
  }

  provider = require(`./${config.get('snapshot').provider||'event_number'}_provider`);
  if (!provider)
    throw Error(
      err.configFailed,
      i18n.t('快照提供服务未正确配置，可以在config/snapshot.js中指定')
    );

}
