import Queue from 'bull';
import config from '../config';
import assert from 'assert';
import {getDispatcher} from './index';

export default class MqWorker {
  get queue() {
    if (this._queue) {
      return this._queue;
    }
    const config = config.get('bus')[this.type + 'MQ'];
    assert(config);
    this._queue = Queue(config.name, config.port, config.host);
    return this._queue;
  }

  run() {
    if (this.isrun){
      return;
    }
    this.isrun = true;
    this.queue.process(getDispatcher().dispatch);
  }

  pause() {
    queue.pause().then(function() {
      // queue is paused now
    });
  }

  resume() {
    queue.resume().then(function() {
      // queue is resumed now
    });
  }

}
