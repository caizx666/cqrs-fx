import config from '../config';
import err from '../err';
import i18n from '../i18n';
import EventSourcedRepository from './event_sourced_repository';
import Repository from './repository';

let repository;

export function getRepository() {
  if (repository) {
    return repository;
  }

  const repConfig = config.get('repository')

  let repositoryLoader = typeof repConfig.type === 'function' ? repConfig.type : null;

  let repInstance = repConfig.type == 'event_sourced' ? new EventSourcedRepository() : repositoryLoader ? repositoryLoader() : repConfig.type;


  if (!(repInstance instanceof Repository))
    throw Error(
      err.configFailed,
      i18n.t('领域仓库未正确配置，可以在config/repository.js中指定')
    );

  repository = repInstance;

  return repository;
};
