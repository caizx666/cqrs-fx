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

  async visit(spec, sort, visitor) {
    assert(isFunction(visitor));
    let ret = this.list;
    if (typeof spec == 'object') {
      ret = ret.filter(item => this.filter(item, spec));
    }
    if (typeof options == 'object') {
      ret.sort((a, b) => this.sort(a, b, sort));
    }
    for (const item of ret) {
      await visitor(item);
    }
  }

  first(spec, sort) {
    if (!spec) {
      return this.list[0];
    }
    let ret = this.list;
    if (typeof spec == 'object') {
      ret = ret.filter(item => this.filter(item, spec));
    }
    if (typeof options == 'object') {
      ret.sort((a, b) => this.sort(a, b, sort));
    }
    return ret[0];
  }

  sort(a, b, options) {
    for (const p in options) {
      if (options[p] > 0 || options[p] == 'DESC') {
        return a[p] < b[p]
          ? 1
          : a[p] == b[p]
            ? 0
            : -1;
      } else {
        return a[p] < b[p]
          ? -1
          : a[p] == b[p]
            ? 0
            : 1;
      }
    }
  }

  delete(sepc, options) {
    let ret = this.list;
    if (typeof spec == 'object') {
      ret = ret.filter(item => this.filter(item, spec));
    }
    ret.forEach(item => {
      this.list.splice(this.list.indexOf(item), 1);
    })
  }

  select(spec, sort) {
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

  async drop() {
    this.list.length = 0;
  }
}
