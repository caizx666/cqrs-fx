import {assert} from 'chai';
import MessageDispatcher from '../../src/bus/message_dispatcher';
import {fxData} from '../../src/core';
import path from 'path';

describe('消息分发器', function() {
  it('同步分发', function() {
    fxData.alias = {};
    fxData.alias['module1/command/AccountCommandHandler'] = path.normalize(__dirname + '/../../demo/module1/command/AccountCommandHandler.js');

    const dispatcher = new MessageDispatcher();
    const listener = ({module,name,type,handler}) => {

      assert(module);
      assert(name);
      assert(type);
      assert(handler);

    }
    dispatcher.addListener(listener, listener, listener);

    assert(dispatcher.dispatch({name: 'module1/createAccount', type: 'command'}) == 1);

    assert(dispatcher.dispatch({name: 'createAccount', module: 'module1', type: 'command'}) == 1);

  });
});
