import repository from '../repository';
import aggregate from '../aggregate';

export default class {
  constructor(){
    this.repository = repository;
    this.domain = aggregate;
  }

  run(command){

  }
}
