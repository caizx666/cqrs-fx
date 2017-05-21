import Bus from './bus';
import {getDispatcher} from './index';
import {getRepository} from '../repository';
import {log} from '../utils';
import i18n from '../i18n';

export default class DirectBus extends Bus {

  _backupMessageArray;

  async commit() {
    log(i18n.t('总线提交') + this.type);
    const dispatcher = getDispatcher(this.type);
    this._backupMessageArray = [...this.messageQueue];
    this.messageQueue.length = 0;
    this.messageQueue.forEach(async(msg) => {
      if (await dispatcher.dispatch(msg)) {
        this._backupMessageArray.splice(this._backupMessageArray.indexOf(msg), 1);
        getRepository().commit();
      // }else{
      //   getRepository().rollback();
      }
    });
    this._committed = true;
  }

  async rollback() {
    if (this._backupMessageArray && this._backupMessageArray.length > 0) {
      this.messageQueue = [
        ...this._backupMessageArray,
        ...this.messageQueue
      ];
    }
    this._committed = false;
    log(i18n.t('总线回滚') + this.type);
  }
}
