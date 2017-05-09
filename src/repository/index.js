import config from '../config';
import err from '../err';
import i18n from '../i18n';

let repository;

export function getRepository() {
  if (repository) {
    return repository;
  }

  repository = config.get('repository').type ?
    require(`./${config.get('repository').type}_repository`) : null;

  if (!repository)
    throw Error(
      err.configFailed,
      i18n.t('领域仓库未正确配置，可以在config/repository.js中指定')
    );

  return repository;
};
