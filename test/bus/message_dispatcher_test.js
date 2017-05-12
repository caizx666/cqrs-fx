import {assert} from 'chai';
import MessageDispatcher from '../../src/bus/message_dispatcher';
import {fxData} from '../../src/core';
import path from 'path';

describe('消息分发器', function () {
  it('同步分发', function () {
    fxData.alias={};
    fxData.alias['module1/command/AccountCommandHandler'] =
      path.normalize(__dirname+ '/../demo/module1/command/AccountCommandHandler.js');
      assert(new MessageDispatcher().getHandlers() == 1);
    assert(new MessageDispatcher().dispatch({
      name: 'module1/createAccount',
      type: 'command'
    }) == 1);
  });
});
