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
    if (!module)
      module = this.module;
      debugger
    return Aggregate.get(name, module);
  }

}
