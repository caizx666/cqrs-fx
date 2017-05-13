export default class Repository {
  get(name, id, ...props) {}

  save(aggregate) {}

  async use(fn) {
    try {
      return await fn();
    } catch (err) {
      this.rollback();
      throw err;
    }
  }

  commit() {}

  rollback() {}
}
