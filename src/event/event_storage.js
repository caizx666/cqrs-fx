import assert from 'assert';
import {isNumber} from '../utils';

export default class EventStorage {
  _addList = [];

  insert({
    id,
    name,
    module,
    source_type,
    source_id,
    timestamp,
    branch,
    version,
    ...data
  }) {
    assert(id);
    assert(name);
    assert(module);
    assert(source_type);
    assert(source_id);
    assert(timestamp);
    assert(isNumber(branch));
    assert(isNumber(version));

    this._addList.push({
      id,
      name,
      module,
      source_type,
      source_id,
      timestamp,
      branch,
      version,
      ...data
    });
  }

  rollback() {
    this._addList.length = 0;
  }
}
