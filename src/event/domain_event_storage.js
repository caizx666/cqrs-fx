import config from '../config';
import err from '../err';
import i18n from '../i18n';
import EventStorage from './event_storage';

export default class DomainEventStorage extends EventStorage{
  constructor(eventStorage) {
    super();

    this.eventStorage = eventStorage;
  }

  async loadEvents(name, id, version) {
    let results;
    if (version) {
      results = await this.eventStorage.select({
        event_type: name,
        event_id: id,
        version: ['<', version]
      });
    }
    results = await this.eventStorage.select({
      event_type: name,
      event_id: id
    });
    let events = [];
    results.forEach(s => {
      events.push({
        data: JSON.parse(s.data),
        data: s.data,
        eventname: s.name,
        eventid: s.event_id,
        sourceid: s.source_id,
        branch: s.branch,
        version: s.version,
        timestamp: s.timestamp
      });
    });
    return events;
  }

  async saveEvent(event) {
    await this.eventStorage.inert({
      id: uuid.v1(),
      eventname: event.name,
      eventid: event.id,
      sourceid: event.sourceid,
      data: JSON.stringify(event.data),
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
