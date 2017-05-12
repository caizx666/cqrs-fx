import {
  CommandHandler
} from '../../../src';

export default class AccountCommandHandler extends CommandHandler {
  createAccount(message) {
    this.repository.use(() => {
      const userAccount = this.getAggregate('UserAccount').create(message);
      this.repository.save(userAccount);
      this.repository.commit();
    });
  }

  deleteAccount(message) {
    this.repository.use(() => {
        const userAccount = this.repository.get('UserAccount');
        userAccount.delete();
        this.repository.save(userAccount);
        this.repository.commit();
      }
    }
  }
