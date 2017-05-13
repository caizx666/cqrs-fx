import EventStorage from './event_storage';
import assert from 'assert';

export default class DomainEventStorage extends EventStorage {
  constructor(eventStorage) {
    super();
    this.eventStorage = eventStorage;
  }

  insert(evt) {
    return this.eventStorage.insert(evt);
  }

  async count(sepc) {
    return await this.eventStorage.count(sepc);
  }

  async loadEvents(aggregateRootAlias, id, version) {
    let results;
    if (version) {
      results = await this.eventStorage.select({
        source_type: aggregateRootAlias,
        source_id: id,
        version: ['<', version]
      });
    } else {
      results = await this.eventStorage.select({source_type: aggregateRootAlias, source_id: id});
    }
    return results.map(s => ({
      id: s.id,
      data: s.data,
      name: s.name,
      sourceId: s.source_id,
      sourceAlias: s.source_type,
      branch: s.branch,
      version: s.version,
      timestamp: s.timestamp
    }));
  }

  async saveEvent(event) {
    assert(event.id);
    assert(event.name);
    assert(event.sourceId);
    assert(event.sourceAlias);

    await this.eventStorage.insert({
      id: event.id,
      name: event.name,
      source_id: event.sourceId,
      source_type: event.sourceAlias,
      data: event.data,
      timestamp: event.timestamp,
      branch: event.branch,
      version: event.version
    });
  }

  async commit() {
    await this.eventStorage.commit();
  }

  async rollback() {
    await this.eventStorage.rollback();
  }
}
