import {assert} from 'chai';
import path from 'path';
import {App, bus} from '../src';
import {fxData} from '../src/core';

describe('App', function() {
  it('可以加载模块文件', function() {
    new App({
      appPath: path.normalize(__dirname + '/../demo')
    }).run();
    assert(fxData.alias['module1/domain/UserAccount']);
    assert(fxData.alias['module1/command/AccountCommandHandler']);
    assert(fxData.alias['module1/event/AccountEventHandler']);
  });

  it('执行命令', function() {
    new App({
      appPath: path.normalize(__dirname + '/../demo')
    }).run(app => {
      app.publishCommand({
        name: 'module1/createAccount',
        data: {
          userName: 'abddddddddd',
          password: '1234456@11eettff$%'
        }
      });
    });
  });
});
