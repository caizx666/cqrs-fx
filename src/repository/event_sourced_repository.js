import eventSourced from './event_sourced_repository';
import {
  provider as snapshotProvider
} from '../snapshot';
import aggregate from '../aggregate';
import {
  storage as domainEventStorage
} from '../event';
import {
  isFunction,
  isString
} from '../utils';
import {
  eventbus
} from '../bus';

export default class {
  constructor() {
    this._saveHash = [];
  }

  createAggregate(name, id, props) {
    let CLS = aggregate.get(name);
    if (!CLS || !isFunction(CLS))
      return null;
    return new CLS(id, ...props);
  }

  async get(name, id, ...props) {
    if (!name || !id || !isString(name) || !isString(id)) return null;
    let aggregateRoot = this.createAggregate(name, id, props);
    if (!aggregateRoot) return null;
    if (snapshotProvider && await snapshotProvider.hasSnapshot(name, id)) {
      let snapshot = await snapshotProvider.getSnapshot(name, id);
      aggregateRoot.buildFromSnapshot(snapshot);
      var eventsAfterSnapshot = await domainEventStorage.loadEvents(name, id, snapshot.Version);
      if (eventsAfterSnapshot && eventsAfterSnapshot.length > 0)
        aggregateRoot.buildFromHistory(eventsAfterSnapshot);
    } else {
      aggregateRoot.id = id;
      let evnts = await domainEventStorage.loadEvents(name, id);
      if (evnts != null && evnts.Count() > 0)
        aggregateRoot.buildFromHistory(evnts);
      else
        throw {
          code: err.aggregateNotExists,
          msg: `领域对象(id=${id})未能在数据库中找到.`
        };
    }
    return aggregateRoot;
  }

  async save(aggregate) {
    if (this._saveHash.indexOf(aggregate) > -1)
      return;
    this._saveHash.push(aggregate);
  }

  async commit() {
    for (let aggregateRoot of this._saveHash) {
      if (snapshotProvider && snapshotProvider.option == 'immediate') {
        if (await snapshotProvider.canCreateOrUpdateSnapshot(aggregateRoot)) {
          await snapshotProvider.createOrUpdateSnapshot(aggregateRoot);
        }
      }
      let events = aggregateRoot.uncommittedEvents;
      for (let evt of events) {
        await domainEventStorage.saveEvent(evt);
        await eventbus.publish(evt);
      }
    }
    // todo 这里需要事务
    await domainEventStorage.commit();
    await eventbus.commit();
    if (snapshotProvider && snapshotProvider.option == 'immediate') {
      await snapshotProvider.commit();
    }
  }

  async rollback() {
    await domainEventStorage.Rollback();
    if (snapshotProvider && snapshotProvider.option == 'immediate') {
      await snapshotProvider.Rollback();
    }
  }
}
