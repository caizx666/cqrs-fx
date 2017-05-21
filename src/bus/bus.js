import {isString, log, uuid} from '../utils';
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
      if (!isString(msg.module) && msg.name.indexOf('/') <= 0) {
        throw new Error(i18n.t('消息module名称无效，无法发布'));
      }
    }
    for (let msg of messages) {
      if (!msg) {
        log(i18n.t('无效消息跳过'))
        continue;
      }
      if (!isString(msg.id)) {
        msg.id = uuid.v1();
      }
      if (!isString(msg.module)) {
        const mn = msg.name.split('/');
        msg.module = mn[0];
        msg.name = mn[1];
      }
      msg.type = this.type;
      this.messageQueue.push(msg);
      this._committed = false;
    }
  }

  clear() {
    this.messageQueue.length = 0;
  }

}
