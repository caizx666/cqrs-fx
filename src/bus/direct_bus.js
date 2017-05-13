import Bus from './bus';
import {getDispatcher} from './index';

export default class DirectBus extends Bus {
  async commit() {
    const dispatcher = getDispatcher(this.type);
    this.messageQueue.forEach(async(msg) => {
      await dispatcher.dispatch({type: this.type, module: msg.module, name: msg.name, data: msg.data});
    });
    this.messageQueue.length = 0;
  }

  async rollback() {
    await getRepository().rollback();
  }
}
