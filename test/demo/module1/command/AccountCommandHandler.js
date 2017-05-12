import {
  CommandHandler
} from '../../../src';

export default class AccountCommandHandler extends CommandHandler {
  createAccount(message) {
    const userAccount = this.getAggregate('UserAccount').create(message);
    this.repository.save(userAccount);
    this.repository.commit();
    return true;
  }

  deleteAccount(message){
    const userAccount =  this.repository.get('UserAccount');
    userAccount.delete();
    this.repository.save(userAccount);
    this.repository.commit();
    return true;
  }
}
