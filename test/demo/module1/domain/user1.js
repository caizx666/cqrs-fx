import {aggregate} from '../../../src';

export default class user1 extends aggregate{
  name ;
  age ;

  static create(name, age){
    let user = new user1();
    user.raiseEvent('created', {name,age});
  }

  createdEvent(name, age){
    this.name = name;
    this.age = age;
  }
}
