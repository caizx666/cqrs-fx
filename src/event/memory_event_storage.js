import EventStorage from './event_storage';
import assert from 'assert';
import {
  isFunction
} from '../utils'

export default class MemoryEventStorage extends EventStorage {
  list = [];

  count(spec) {
    if (!spec) {
      return this.list.length;
    }
    return this.list.filter(item => this.filter(item, spec)).length;
  }

  async visit(spec, visitor) {
    assert(isFunction(visitor));
    this.list.filter(item => this.filter(item, spec)).forEach(visitor);
  }

  select(spec) {
    if (!spec) {
      return [...this.list];
    }
    return this.list.filter(item => this.filter(item, spec));
  }

  filter(item, spec) {
    for (const p in spec) {
      if (spec[p].length && spec[p].length > 1) {
        if (spec[p][0] == '>') {
          if (item[p] <= spec[p][1]) {
            return false;
          } else {
            continue;
          }
        }
        if (spec[p][0] == '<') {
          if (item[p] >= spec[p][1]) {
            return false;
          } else {
            continue;
          }
        }
      }
      if (item[p] != spec[p]) {
        return false;
      }
    }
    return true;
  }

  commit() {
    this.list = this.list.concat(this._addList);
    this._addList.length = 0;
  }

}
