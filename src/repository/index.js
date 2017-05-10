import config from '../config';
import err from '../err';
import i18n from '../i18n';

let repository;

export function getRepository() {
  if (repository) {
    return repository;
  }

  const Repository = config.get('repository').type ?
    require(`./${config.get('repository').type}_repository`).default : null;

  if (!Repository)
    throw Error(
      err.configFailed,
      i18n.t('领域仓库未正确配置，可以在config/repository.js中指定')
    );
  repository = new Repository();
  return repository;
};
