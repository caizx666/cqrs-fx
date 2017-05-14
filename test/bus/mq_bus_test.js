import {assert} from 'chai';
import {fxData} from '../../src/core';
import path from 'path';

import config from '../../src/config';

import MqBus from '../../src/bus/mq_bus';
import MqWorker from '../../src/bus/mq_worker';

import {getCommandDispatcher} from '../../src/bus';

describe('MesageQueue', function() {
  it('消息队列发送并接收异步执行', async function() {

    fxData.alias = {};
    fxData.alias['module1/command/AccountCommandHandler'] = path.normalize(__dirname + '/../../demo/module1/command/AccountCommandHandler.js');
    fxData.alias['module1/event/AccountEventHandler'] = path.normalize(__dirname + '/../../demo/module1/event/AccountEventHandler.js');
    fxData.alias['module1/domain/AdminAccount'] = path.normalize(__dirname + '/../../demo/module1/domain/AdminAccount.js');
    fxData.alias['module1/domain/UserAccount'] = path.normalize(__dirname + '/../../demo/module1/domain/UserAccount.js');

    fxData.container = {};

    config.init({
      bus: {
        eventBus: 'direct',
        commandMQ: {
          name: 'commandqueue',
          port: 6379,
          host: '127.0.0.1'
        }
      },
      event: {
        storage: 'memory_domain_event'
      },
      snapshot: {
        storage: 'memory'
      },
      log: {
        enable: true
      }
    });

    const bus = new MqBus('command');
    const worker = new MqWorker('command');

    bus.publish({
      name: 'module1/createAccount',
      data: {
        userName: 'aaa',
        password: '11144'
      }
    });
    bus.commit();

    const listener = ({module, name, type, handler}) => {

      worker.queue.close();

    }
    getCommandDispatcher().addListener(null, listener, null);

    await worker.run();
  });
});
