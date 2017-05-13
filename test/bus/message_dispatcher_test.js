import {assert} from 'chai';
import MessageDispatcher from '../../src/bus/message_dispatcher';
import {fxData} from '../../src/core';
import path from 'path';
import config from '../../src/config';

config.init({
  bus: {
    commandBus: 'direct',
    eventBus: 'direct'
  },
  event: {
    storage: 'memory_domain_event'
  },
  snapshot: {
    storage: 'memory'
  }
});

describe('分发', function() {
  it('同步分发', async function() {
    fxData.alias = {};
    fxData.alias['module1/command/AccountCommandHandler'] = path.normalize(__dirname + '/../../demo/module1/command/AccountCommandHandler.js');
    fxData.alias['module1/domain/AdminAccount'] = path.normalize(__dirname + '/../../demo/module1/domain/AdminAccount.js');
    fxData.alias['module1/domain/UserAccount'] = path.normalize(__dirname + '/../../demo/module1/domain/UserAccount.js');

    const dispatcher = new MessageDispatcher('command');
    const listener = ({module, name, type, handler}) => {

      assert(module);
      assert(name);
      assert(type);
      assert(handler);

    }
    dispatcher.addListener(listener, listener, listener);
 
    assert.equal((await dispatcher.dispatch({
      name: 'module1/createAccount',
      type: 'command',
      data: {
        userName: 'aaa',
        password: 'bbeeeb'
      }
    })), 1);

    assert.equal((await dispatcher.dispatch({
      name: 'createAccount',
      module: 'module1',
      type: 'command',
      data: {
        userName: 'aa22a',
        password: 'bsssbb'
      }
    })), 1);

  });
});
