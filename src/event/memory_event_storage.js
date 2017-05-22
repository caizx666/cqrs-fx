import EventStorage from './event_storage';
import assert from 'assert';
import {isFunction} from '../utils'

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
      if (typeof spec[p] === 'object') {
        if ('$gt' in spec[p]) {
          if (item[p] <= spec[p]['$gt']) {
            return false;
          } else {
            continue;
          }
        }
        if ('$lt' in spec[p]) {
          if (item[p] >= spec[p]['$lt']) {
            return false;
          } else {
            continue;
          }
        }
        if ('$gte' in spec[p]) {
          if (item[p] < spec[p]['$gte']) {
            return false;
          } else {
            continue;
          }
        }
        if ('$lte' in spec[p]) {
          if (item[p] > spec[p]['$lte']) {
            return false;
          } else {
            continue;
          }
        }
        if ('$in' in spec[p]) {
          if (spec[p]['$in'].indexOf(item[p]) == -1) {
            return false;
          } else {
            continue;
          }
        }
      } else if (item[p] != spec[p]) {
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
