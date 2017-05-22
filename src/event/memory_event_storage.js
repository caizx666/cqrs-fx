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

  visit(spec, visitor) {
    assert(isFunction(visitor));
    this.list.filter(item => this.filter(item, spec)).forEach(visitor);
  }

  first(spec, sort) {
    if (!spec) {
      return this.list[0];
    }
    return this.list.filter(item => this.filter(item, spec)).sort((a, b) => this.sort(a, b, sort))[0];
  }

  sort(a, b, options) {
    if (typeof options == 'object') {
        for (const p in options) {
          
        }
    } else {
      return a > b
        ? 1
        : a == b
          ? 0
          : -1;
    }
  }

  delete(sepc, options) {
    const removes = this.list.filter(item => this.filter(item, spec));
    removes.forEach(item => {
      this.list.splice(this.list.indexOf(item), 1);
    })
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
