import assert from 'assert';
import {isNumber} from '../utils';

export default class SnapshotStorage {
  _actionList = []

  count(spec) {}

  first(spec) {}

  commit() {}

  insert({
    id,
    aggregate_root_type,
    aggregate_root_id,
    version,
    branch,
    timestamp,
    ...data
  }) {
    assert(id);
    assert(aggregate_root_type);
    assert(aggregate_root_id);
    assert(version);
    assert(isNumber(branch));
    assert(timestamp);

    this._actionList.push({
      action: 0,
      data: {
        id,
        aggregate_root_type,
        aggregate_root_id,
        version,
        branch,
        timestamp,
        ...data
      }
    });
  }

  update({
    id, // id剔除
    aggregate_root_type,
    aggregate_root_id,
    version,
    branch,
    timestamp,
    ...data
  }, spec) {

    assert(aggregate_root_type);
    assert(aggregate_root_id);
    assert(version);
    assert(isNumber(branch));
    assert(timestamp);

    this._actionList.push({
      action: 1,
      data: {
        aggregate_root_type,
        aggregate_root_id,
        version,
        branch,
        timestamp,
        ...data
      },
      spec: {
        id,
        ...spec
      }
    });
  }

  rollback() {
    this._actionList.length = 0;
  }
}
