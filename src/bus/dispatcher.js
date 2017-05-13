import assert from 'assert';

export default class Dispatcher {
  type;

  constructor(type) {
    assert(type);
    this.type = type;
  }

  dispatch(message) {}
}
