import co from 'co';

export default class Repository {
  async get(name, id, ...props) {}

  async save(aggregate) {}

  use(fn){
    return co(fn).catch(this.rollback);
  }

  async commit() {}

  async rollback() {}
}
