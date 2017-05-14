import Bus from './bus';
import {getDispatcher} from './index';
import {log} from '../utils';
import i18n from '../i18n';

export default class DirectBus extends Bus {
  async commit() {
    log(i18n.t('提交分发'));
    const dispatcher = getDispatcher(this.type);
    this.messageQueue.forEach(async(msg) => {
      await dispatcher.dispatch({type: this.type, module: msg.module, name: msg.name, data: msg.data});
    });
    this.messageQueue.length = 0;
  }

  async rollback() {
    await getRepository().rollback();
    log(i18n.t('回滚存储'));
  }
}
