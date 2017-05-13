export default {
  // 默认值
  dispatcher : 'message_dipatcher',
  commandBus : 'direct',
  eventBus : 'mq',
  eventMQ : {
    name: 'eventqueue',
    port: 6379,
    host: '127.0.0.1'
  }
};
