import {CommandHandler} from '../../../src';

export default class AccountCommandHandler extends CommandHandler {
  async createAccount(message) {
    await this.repository.use(async() => {
      const userAccount = this.getAggregate('UserAccount').create(message);
      await this.repository.save(userAccount);
      await this.repository.commit();
    });
  }

  async deleteAccount(message) {
    await this.repository.use(async() => {
      const userAccount = this.repository.get('UserAccount');
      userAccount.delete();
      await this.repository.save(userAccount);
      await this.repository.commit();
    });
  }
}
