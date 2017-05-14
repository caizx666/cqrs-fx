import {assert} from 'chai';
import MessageDispatcher from '../../src/bus/message_dispatcher';
import {fxData} from '../../src/core';
import path from 'path';
import config from '../../src/config';

describe('MessageDispatcher', function() {
  it('同步分发', async function() {
    fxData.alias = {};
    fxData.alias['module1/command/AccountCommandHandler'] = path.normalize(__dirname + '/../../demo/module1/command/AccountCommandHandler.js');
    fxData.alias['module2/command/AccountCommandHandler2'] = path.normalize(__dirname + '/../../demo/module2/command/BookCommandHandler.js');
    fxData.alias['module2/command/BookCommandHandler'] = path.normalize(__dirname + '/../../demo/module2/command/AccountCommandHandler2.js');
    fxData.alias['module1/domain/AdminAccount'] = path.normalize(__dirname + '/../../demo/module1/domain/AdminAccount.js');
    fxData.alias['module1/domain/UserAccount'] = path.normalize(__dirname + '/../../demo/module1/domain/UserAccount.js');
    fxData.container = {};

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

    const dispatcher = new MessageDispatcher('command');
    dispatcher.createAndRegisterAlias();

    assert.equal(dispatcher.getHandlers('module1/createAccount').length, 3);
    assert.equal(dispatcher.getHandlers('createBook', 'module2').length, 1);
    assert.equal(dispatcher.getHandlers('module2/createBook2').length, 0);

    const listener = ({module, name, type, handler}) => {

      assert(module);
      assert(name);
      assert(type);
      assert(handler);

    }
    dispatcher.addListener(listener, listener, listener);

    await dispatcher.dispatch({
      name: 'module1/createAccount',
      type: 'command',
      data: {
        userName: 'aaa',
        password: 'bbeeeb'
      }
    });

    await dispatcher.dispatch({
      name: 'createAccount',
      module: 'module1',
      type: 'command',
      data: {
        userName: 'aa22a',
        password: 'bsssbb'
      }
    });

  });
});
