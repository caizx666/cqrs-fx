import * as repository from '../repository';
import aggregate from '../aggregate';

export default class CommandHandler {
  constructor() {
    this.repository = repository.getRepository();
    this.aggregate = aggregate;
    this.module = null; // module会在构造完后赋值
  }

  get(name, module) {
    if (!module)
      module = this.module;
    return aggregate.get(name, module);
  }

  run(command) {

  }
}
