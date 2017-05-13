export default class Bus {
  constructor(type) {
    this.type = type;
  }

  publish(...messages) {}

  clear() {}

  async commit() {}

  async rollback() {}

}
