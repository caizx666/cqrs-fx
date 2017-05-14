import Bus from './bus';
import {getDispatcher} from './index';
import {log} from '../utils';
import i18n from '../i18n';

export default class DirectBus extends Bus {

  _backupMessageArray;


  async commit() {
    log(i18n.t('总线提交')+this.type);
    const dispatcher = getDispatcher(this.type);
    this._backupMessageArray = [...this.messageQueue];
    this.messageQueue.forEach(async(msg) => {
      await dispatcher.dispatch({type: this.type, module: msg.module, name: msg.name, data: msg.data});
    });
    this._committed = true;
    this.messageQueue.length = 0;
  }

  async rollback() {
    if (this._backupMessageArray && this._backupMessageArray.length > 0) {
      this.messageQueue = [...this._backupMessageArray];
    }
    this._committed = false;
    log(i18n.t('总线回滚')+this.type);
  }
}
