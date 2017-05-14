import Bus from './bus';
import Queue from 'bull';
import config from '../config';
import assert from 'assert';
import {log} from '../utils';
import i18n from '../i18n';

export default class MqBus extends Bus {

  get queue() {
    if (this._queue) {
      return this._queue;
    }
    const mqconfig = config.get('bus')[this.type + 'MQ'] || {};
     log(i18n.t('连接mq'));
    this._queue = Queue(mqconfig.name, mqconfig.port, mqconfig.host);
    return this._queue;
  }

  commit() {
    this.messageQueue.forEach(async(msg) => {      
      this.queue.add(msg);
      log(i18n.t('发送mq消息'));
    });
    this.messageQueue.length = 0;
  }

}
