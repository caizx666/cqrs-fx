import {assert} from 'chai';
import * as bus from '../../src/bus';

describe('消息总线', function () {
  it('发送命令同步执行', function () {
    debugger
    bus.publishCommand({
      name: 'do1',
      data:{
        key1: 1,
        key2: {
          a:'hello',
          b: 28
        }
      }
    });
  });
});
