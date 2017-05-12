import * as repository from '../repository';
import Aggregate from '../aggregate';

export default class CommandHandler {
  constructor(module) {
    this.module = module;
  }

  get repository(){
    return repository.getRepository();
  }

  getAggregate(name, module) {
    if (!module)
      module = this.module;
    return Aggregate.get(name, module);
  }

  run(message) {
    return true;
  }
}
