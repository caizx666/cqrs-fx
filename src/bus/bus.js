import {isString, log} from '../utils';
import i18n from '../i18n';

export default class Bus {
  messageQueue = []

  _committed = true;

  get committed() {
    return this._committed;
  }

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
        log(i18n.t('无效消息跳过'))
        continue;
      }
      this.messageQueue.push(msg);
      this._committed = false;
    }
  }

  clear() {
    this.messageQueue.length = 0;
  }

}
