import {getProvider as getSnapshotProvider} from '../snapshot';
import aggregate from '../aggregate';
import {getStorage as getEventStorage} from '../event';
import {isFunction, isString, log} from '../utils';
import err from '../err';
import {getEventBus} from '../bus';
import i18n from '../i18n';
import Repository from './repository';

export default class EventSourcedRepository extends Repository {
  _saveHash = []

  createAggregate(module, name, id, props) {
    let CLS = aggregate.get(name, module);
    if (!CLS || !isFunction(CLS))
      return null;
    return new CLS(id, ...props);
  }

  async get(name, id, module, ...props) {
    if (!name || !id || !isString(name) || !isString(id))
      return null;
    if (!isString(module)) {
      const mn = name.split('/');
      if (mn.length != 2) {
        log(i18n.t('领域对象无法找到') + name);
        return null;
      }
      module = mn[0];
      name = mn[1];
    }
    let aggregateRoot = this.createAggregate(module, name, id, props);
    if (!aggregateRoot)
      return null;
    const aggregateRootAlias = `${module}/domain/${name}`;
    const snapshotProvider = getSnapshotProvider();
    if (snapshotProvider && await snapshotProvider.hasSnapshot(aggregateRootAlias, id)) {
      let snapshot = await snapshotProvider.getSnapshot(aggregateRootAlias, id);
      aggregateRoot.buildFromSnapshot(snapshot);
      var eventsAfterSnapshot = await getEventStorage().loadEvents(aggregateRootAlias, id, snapshot.version);
      if (eventsAfterSnapshot && eventsAfterSnapshot.length > 0)
        aggregateRoot.buildFromHistory(...eventsAfterSnapshot);
      }
    else {
      aggregateRoot.id = id;
      let evnts = await getEventStorage().loadEvents(aggregateRootAlias, id);
      if (evnts != null && evnts.length > 0) {
        aggregateRoot.buildFromHistory(...evnts);
      } else {
        log(i18n.t('领域对象未能在数据库中找到:') + `(id=${id})`);
        return null;
      }
    }
    return aggregateRoot;
  }

  async save(aggregate) {
    if (this._saveHash.indexOf(aggregate) > -1)
      return;
    this._saveHash.push(aggregate);
  }

  async commit() {
    const snapshotProvider = getSnapshotProvider();
    const eventStorage = getEventStorage();
    const eventBus = getEventBus();
    for (let aggregateRoot of this._saveHash) {
      if (snapshotProvider && snapshotProvider.option == 'immediate') {
        if (await snapshotProvider.canCreateOrUpdateSnapshot(aggregateRoot)) {
          await snapshotProvider.createOrUpdateSnapshot(aggregateRoot);
        }
      }
      let events = aggregateRoot.uncommittedEvents;
      for (let evt of events) {
        await eventStorage.saveEvent(evt);
        await eventBus.publish(evt);
      }
    }
    // todo 这里需要事务
    await eventStorage.commit();
    await eventBus.commit();
    if (snapshotProvider && snapshotProvider.option == 'immediate') {
      await snapshotProvider.commit();
    }
  }

  async rollback() {
    await getEventStorage().rollback();
    const snapshotProvider = getSnapshotProvider();
    if (snapshotProvider && snapshotProvider.option == 'immediate') {
      await snapshotProvider.rollback();
    }
  }
}
