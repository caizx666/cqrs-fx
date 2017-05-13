import {assert} from 'chai';
import * as bus from '../../src/bus';
import config from '../../src/config';
import {fxData} from '../../src/core';

config.init({bus: {}});

describe('总线', function() {
  it('发送命令同步执行', function() {

    fxData.alias = {};
    fxData.alias['module1/command/AccountCommandHandler'] = path.normalize(__dirname + '/../../demo/module1/command/AccountCommandHandler.js');
    fxData.alias['module1/domain/AdminAccount'] = path.normalize(__dirname + '/../demo/module1/domain/AdminAccount.js');
    fxData.alias['module1/domain/UserAccount'] = path.normalize(__dirname + '/../demo/module1/domain/UserAccount.js');

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
});
