import Bus from './bus';
import Queue from 'bull';
import config from '../config';
import assert from 'assert';

export default class MqBus extends Bus {
  get queue() {
    if (this._queue) {
      return this._queue;
    }
    const config = config.get('bus')[this.type + 'MQ'];
    assert(config);
    this._queue = Queue(config.name, config.port, config.host);
    return this._queue;
  }

  commit() {
    this.messageQueue.forEach(async(msg) => {
      this.queue.add({type: this.type, module: msg.module, name: msg.name, data: msg.data});
    });
    this.messageQueue.length = 0;
  }

}
