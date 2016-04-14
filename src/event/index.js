import domainEventStorage from './domain_event_storage';
import jsonSerializer from './json_serializer';

let storage = config.get('event').storage == 'default'? domainEventStorage: null;
  if (!storage)
    throw {code:err.configFailed, msg: '事件仓库未正确配置，可以在config/event.js中指定'};

let serializer = config.get('event').serializer == 'default'? jsonSerializer: null;
      if (!serializer)
        throw {code:err.configFailed, msg: '事件序列化服务未正确配置，可以在config/snapshot.js中指定'};

export default{
  storage,
  serializer
}
