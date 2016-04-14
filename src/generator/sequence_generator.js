import uuid from 'node-uuid';

export default class{
  get generate(){
    // Generate a v1 (time-based) id
    return uuid.v1();
  }
}
