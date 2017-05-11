import * as snapshot from '../snapshot';
import aggregate from '../aggregate';
import * as event from '../event';
import {
  isFunction,
  isString
} from '../utils';
import * as bus from '../bus';
import i18n from '../i18n';

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
    const snapshotProvider = snapshot.getProvider();
    if (snapshotProvider && await snapshotProvider.hasSnapshot(name, id)) {
      let snapshot = await snapshotProvider.getSnapshot(name, id);
      aggregateRoot.buildFromSnapshot(snapshot);
      var eventsAfterSnapshot = await event.getStorage().loadEvents(name, id, snapshot.Version);
      if (eventsAfterSnapshot && eventsAfterSnapshot.length > 0)
        aggregateRoot.buildFromHistory(eventsAfterSnapshot);
    } else {
      aggregateRoot.id = id;
      let evnts = await event.getStorage().loadEvents(name, id);
      if (evnts != null && evnts.Count() > 0)
        aggregateRoot.buildFromHistory(evnts);
      else
        throw {
          code: err.aggregateNotExists,
          msg: i18n.t('领域对象未能在数据库中找到:')+`(id=${id})`
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
    const snapshotProvider = snapshot.getProvider();
    for (let aggregateRoot of this._saveHash) {
      if (snapshotProvider && snapshotProvider.option == 'immediate') {
        if (await snapshotProvider.canCreateOrUpdateSnapshot(aggregateRoot)) {
          await snapshotProvider.createOrUpdateSnapshot(aggregateRoot);
        }
      }
      let events = aggregateRoot.uncommittedEvents;
      for (let evt of events) {
        await event.getStorage().saveEvent(evt);
        await bus.getEventBus().publish(evt);
      }
    }
    // todo 这里需要事务
    await event.getStorage().commit();
    await bus.getEventBus().commit();
    if (snapshotProvider && snapshotProvider.option == 'immediate') {
      await snapshotProvider.commit();
    }
  }

  async rollback() {
    await event.getStorage().Rollback();
    const snapshotProvider = snapshot.getProvider();
    if (snapshotProvider && snapshotProvider.option == 'immediate') {
      await snapshotProvider.Rollback();
    }
  }
}
