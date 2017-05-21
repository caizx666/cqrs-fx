import * as repository from '../repository';
import Aggregate from '../aggregate';

export default class CommandHandler {

  get module() {
    return this.__module;
  }

  get repository() {
    return repository.getRepository();
  }

  getAggregate(name, module) {
    return Aggregate.get(name, module || this.module);
  }

}
