import {CommandHandler, command} from '../../../src';

export default class BookCommandHandler extends CommandHandler {
  createBook(message) {
    console.log('create book');
  }

}
