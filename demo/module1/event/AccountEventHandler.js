import {
  EventHandler
} from '../../../src';

export default class AccountEventHandler extends EventHandler {
  accountCreated(message) {
    console.log('account created', ...message);
    return true;
  }

  accountDeleted(message){
    console.log('account deleted', ...message);
    return true;
  }
}
