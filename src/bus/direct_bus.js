import co from 'co';
import * as repository from '../repository';
import {
  isString
} from '../utils';
import i18n from '../i18n';
import Bus from './bus';

export default class DirectBus extends Bus{
  constructor(type, dispatcher) {
    super();
    this.messageQueue = [];
    this.type = type;
    this.dispatcher = dispatcher;
  }

  publish(...messages) {
    for (let msg of messages) {
      if (!msg) {
        continue;
      }
      if (!isString(msg.name)) {
        throw new Error(i18n.t('消息名称无效，无法发布'));
      }
    }
    for (let msg of messages) {
      if (!msg) {
        continue;
      }
      this.messageQueue.push(msg);
    }
  }

  clear() {
    this.messageQueue.length = 0;
  }

  async commit() {
    this.messageQueue.forEach(msg => {
      this.dispatcher.dispatch({
        type: this.type,
        name: msg.name,
        data: msg.data
      });
    });
    const rep = repository.getRepository();
    await co(rep.commit());
    this.messageQueue.length = 0;
  }

  async rollback() {
    await co(repository.getRepository().rollback());
  }
}
