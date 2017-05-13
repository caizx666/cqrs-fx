import {isString} from '../utils';
import i18n from '../i18n';

export default class Bus {
  messageQueue = []

  constructor(type) {
    this.type = type;
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

  async commit() {}

  async rollback() {}

}
