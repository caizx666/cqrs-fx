export default class SnapshotProvider {

  async hasSnapshot(name, id) {}

  async getSnapshot(name, id) {}

  async canCreateOrUpdateSnapshot(aggregateRoot) {}

  async createOrUpdateSnapshot(aggregateRoot) {}

  async commit() {}

  async rollback() {}
}
