import {fxData, _require} from './core';
import err from './err';
import {timestamp, uuid, isFunction} from './utils';

const DEFAULT_BRACH = 0;
const DEFAULT_VERSION = 0;

export default class Aggregate {
  constructor(id) {
    this._version = DEFAULT_VERSION;
    this._branch = DEFAULT_BRACH;
    this._uncommittedEvents = [];
    this._eventVersion = this.version;
    this._domainEventHandlers = {};
    this._id = id || uuid.v1();
  }

  // 获取聚合根对象类型
  static get(name, module) {
    if (!name) {
      return null;
    }
    if (!module) {
      const mn = name.split('/');
      if (mn.length == 2) {
        module = mn[0];
        name = mn[1];
      }
      if (!module) {
        return null;
      }
    }
    return _require(`${module}/domain/${name}`);
  }

  get module() {
    return this.__module;
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
    this._uncommittedEvents.length = 0;
    for (let de of historicalEvents)
      this._handleEvent(de);
    this._version = historicalEvents[historicalEvents.length - 1].version;
    this._eventVersion = this._version;
  }

  _getDomainEventHandlers(eventname) {
    if (this._domainEventHandlers[eventname])
      return this._domainEventHandlers[eventname];
    let handlers = [];
    if (isFunction(this[eventname])) {
      handlers.push(this[eventname].bind(this));
    }
    this._domainEventHandlers[eventname] = handlers;
    return handlers;
  }

  _handleEvent(event) {
    if (event.module != this.module) {
      return;
    }
    let handlers = this._getDomainEventHandlers(event.name);
    if (isFunction(this.when)) {
      this.when(event);
    }
    for (var handler of handlers) {
      if (isFunction(handler)) {
        handler(event.data);
      }
    }
  }

  buildFromSnapshot(snapshot) {
    this._branch = snapshot.branch;
    this._version = snapshot.version;
    this._id = snapshot.aggregateRootID;
    if (isFunction(this.doBuildFromSnapshot))
      this.doBuildFromSnapshot(snapshot);
    else {
      const {
        branch,
        version,
        timestamp,
        aggregateRootID,
        ...data
      } = snapshot;
      for (const p in data) {
        this[p] = data[p];
      }
    }
    this._uncommittedEvents.length = 0;
  }

  createSnapshot() {
    let snapshot;
    if (isFunction(this.doCreateSnapshot)) {
      snapshot = this.doCreateSnapshot() || {};
    } else {
      const {
        _version,
        _branch,
        _uncommittedEvents,
        _eventVersion,
        _domainEventHandlers,
        _id,
        ...data
      } = this;
      snapshot = data;
    }
    snapshot.branch = this.branch;
    snapshot.version = this.version;
    snapshot.timestamp = timestamp();
    snapshot.aggregateRootID = this._id;
    return snapshot;
  }

  raiseEvent(name, data) {
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
    event.module = this.module;
    event.id = uuid.v1();
    event.version = ++this._eventVersion;
    event.branch = DEFAULT_BRACH;
    event.timestamp = timestamp();
    this._handleEvent(event);
    this._uncommittedEvents.push(event);
  }
}
