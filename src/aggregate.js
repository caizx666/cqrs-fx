import register from './register';
import {
  getType
} from './core';
import err from './err';
import {
  timestamp
} from './utils';

const DEFAULT_BRACH = 0;
const DEFAULT_VERSION = 0;

export default class aggregate {
  constructor(id) {
    this._version = DEFAULT_VERSION;
    this._branch = DEFAULT_BRACH;
    this._uncommittedEvents = [];
    this._eventVersion = this.version;
    this._domainEventHandlers = {};
    this._id = id || null;
  }

  // 获取聚合根对象类型
  static get(name) {
    let alias = register.domain[name];
    if (!alias) return null;
    return getType(alias);
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get uncommittedEvents() {
    return this._uncommittedEvents;
  }

  get version() {
    return this._version + this._uncommittedEvents.length;
  }

  get branch() {
    return this._branch;
  }

  buildFromHistory(...historicalEvents) {
    if (this._uncommittedEvents.Count() > 0)
      this._uncommittedEvents.Clear();
    for (let de of historicalEvents)
      this._handleEvent(de);
    this._version = historicalEvents[historicalEvents.length - 1].version;
    this._eventVersion = this._version;
  }

  _getDomainEventHandlers(eventname) {
    if (this._domainEventHandlers[eventname])
      return this._domainEventHandlers[eventname];
    let handlers = [];
    for (var p in this) {
      let handler = snapshot[p];
      if ((!p.endWith('Event') && !p.endWith('Handler')) || typeof handler !== 'function')
        continue;
      handlers.push(handler);
    }
    this._domainEventHandlers[eventname] = handlers;
    return handlers;
  }

  _handleEvent(event) {
    let handlers = this._getDomainEventHandlers(event.name);
    for (var handler of handlers) {
      handler(event.data);
    }
  }

  buildFromSnapshot(snapshot) {
    this._branch = snapshot.branch;
    this._version = snapshot.version;
    this._id = snapshot.aggregateRootID;
    if (this.doBuildFromSnapshot)
      this.doBuildFromSnapshot(snapshot);
    else {
      for (var p in snapshot) {
        let item = snapshot[p];
        if (typeof item === 'function')
          continue;
        if (!this.hasOwnProperty(p))
          continue;
        this[p] = item;
      }
    }
    this._uncommittedEvents.clear();
  }

  createSnapshot() {
    let snapshot = {};
    if (this.doCreateSnapshot) {
      snapshot = this.doCreateSnapshot();
    } else {
      for (var p in this) {
        let item = this[p];
        if (typeof item === 'function')
          continue;
        snapshot[p] = item;
      }
    }
    snapshot = snapshot || {};
    snapshot.branch = this._branch;
    snapshot.version = this._version;
    snapshot.timestamp = timestamp();
    snapshot.aggregateRootID = this._id;
    return snapshot;
  }

  raise(name, data) {
    let event;
    if (typeof name === 'string') {
      event = {
        name,
        data
      };
    } else {
      event = name;
    }
    if (!event || !event.name)
      return;
    event.id = uuid.v1();
    event.version = ++this._eventVersion;
    event.branch = DEFAULT_BRACH;
    event.timestamp = timestamp();
    this._handleEvent(event);
    this._uncommittedEvents().push(event);
  }
}
