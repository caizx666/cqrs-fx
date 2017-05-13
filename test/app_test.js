import {assert} from 'chai';
import path from 'path';
import {App,bus} from '../src';
import {fxData} from '../src/core';

describe('应用测试', function () {
  it('领域对象UserAccount应该被加载', function () {
    new App({
      appPath: path.normalize(__dirname+ '/../demo')
    }).run();
    assert(fxData.alias['module1/domain/UserAccount']);
    assert(fxData.alias['module1/command/message']);
    assert(fxData.alias['module1/event/AccountEventHandler']);
  });
});
