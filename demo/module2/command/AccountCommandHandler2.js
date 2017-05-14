import {CommandHandler,command} from '../../../src';

export default class AccountCommandHandler2 extends CommandHandler {
  @command('module1/createAccount')
  createAccount2(message) {
    console.log('AccountCommandHandler2 createAccount2 ok');
  }

  @command('module1', 'createAccount')
  createAccount3(message) {
    console.log('AccountCommandHandler2 createAccount3 ok');
  }
}
