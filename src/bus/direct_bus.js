import * as repository from '../repository';

export default class {
  constructor(type, dispatcher){
    this.messageQueue = [];
    this.type = type;
    this.dispatcher = dispatcher;
  }

  publish(...messages){
    for(let msg of messages){
      this.messageQueue.push(msg);
    }
  }

  clear(){
    this.messageQueue.clear();
  }

  commit(){
    this.messageQueue.forEach(msg=>{
      this.dispatcher.dispatch({type, name:msg.name, data:msg.data});
    });
    repository.getRepository().commit();
    this.messageQueue.clear();
  }

  rollback(){
    repository.getRepository().rollback();
  }
}
