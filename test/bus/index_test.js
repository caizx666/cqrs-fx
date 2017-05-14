import {assert} from 'chai';
import * as bus from '../../src/bus';
import {fxData} from '../../src/core';
import path from 'path';

import config from '../../src/config';



describe('Bus', function() {
  it('发送命令同步执行', function() {



    bus.publishCommand({
      name: 'do1',
      data: {
        key1: 1,
        key2: {
          a: 'hello',
          b: 28
        }
      }
    });
  });

  it('发送命令触发事件', function() {

    fxData.alias = {};
    fxData.alias['module1/command/AccountCommandHandler'] = path.normalize(__dirname + '/../../demo/module1/command/AccountCommandHandler.js');
    fxData.alias['module1/domain/AdminAccount'] = path.normalize(__dirname + '/../../demo/module1/domain/AdminAccount.js');
    fxData.alias['module1/domain/UserAccount'] = path.normalize(__dirname + '/../../demo/module1/domain/UserAccount.js');

    fxData.container={};

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
      },
      log:{
        enable: true
      }
    });

    bus.publishCommand({
      name: 'module1/createAccount',
      data: {

      }
    });
  });
});
