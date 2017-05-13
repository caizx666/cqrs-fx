import assert from 'assert';
import {isNumber} from '../utils';

export default class EventStorage {
  _addList = [];

  count(spec) {}

  select(spec) {}

  commit() {}

  insert({
    id,
    eventname,
    eventid,
    sourceid,
    timestamp,
    branch,
    version,
    ...data
  }) {
    assert(id);
    assert(eventname);
    assert(eventid);
    assert(sourceid);
    assert(timestamp);
    assert(isNumber(branch));
    assert(version);

    this._addList.push({
      id,
      eventname,
      eventid,
      sourceid,
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
