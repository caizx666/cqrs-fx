import {assert} from 'chai';
import path from 'path';
import {App,bus} from '../src';
import {fxData} from '../src/core';

describe('应用', function () {
  it('可以加载模块文件', function () {
    new App({
      appPath: path.normalize(__dirname+ '/../demo')
    }).run();
    assert(fxData.alias['module1/domain/UserAccount']);
    assert(fxData.alias['module1/command/AccountCommandHandler']);
    assert(fxData.alias['module1/event/AccountEventHandler']);
  });
});
