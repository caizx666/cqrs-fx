import SnapshotStorage from './snapshot_storage';

export default class MemorySnapshotStorage extends SnapshotStorage {
  list = [];

  count(spec) {
    if (!spec) {
      return this.list.length;
    }
    return this.list.filter(item => {
      for (const p in spec) {
        if (item[p] != spec[p]) {
          return false
        }
      }
      return true;
    }).length;
  }

  first(spec) {
    if (!spec) {
      return [...this.list];
    }
    return (this.list.find(item => {
      for (const p in spec) {
        if (item.data && item.data[p] != spec[p]) {
          return false;
        }
      }
      return true;
    }) || {}).data;
  }

  commit() {
    this.list = this.list.concat(this._actionList.filter(item => item.action == 0));
   this._actionList.filter(item => item.action == 1).forEach(({spec, data}) => {
      let exists = this.list.find(item => {
        for (const p in spec) {
          if (item.data && item.data[p] != spec[p]) {
            return false;
          }
        }
        return true;
      });
      if (exists) {
        exists.data = {
          ...exists.data,
          ...data
        }
      }
    });
    this._actionList.length = 0;
  }

}
