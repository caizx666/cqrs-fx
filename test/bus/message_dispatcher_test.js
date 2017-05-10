import {assert} from 'chai';
import MessageDispatcher from '../../src/bus/message_dispatcher';

describe('消息分发器', function () {
  it('同步分发', function () {
    new MessageDispatcher();
  });
});
