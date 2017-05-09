import * as repository from '../repository';
import aggregate from '../aggregate';

export default class {
  constructor(){
    this.repository = repository.getRepository();
    this.aggregate = aggregate;
  }

  run(command){

  }
}
