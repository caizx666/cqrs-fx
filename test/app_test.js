import {assert} from 'chai';
import path from 'path';
import {App,bus} from '../src';
import {registry} from '../src/register';

describe('应用测试', function () {
  it('模块加载数量应该和文件夹里的一致', function () {
    new App({
      appPath: path.join(__dirname, 'demo')
    }).run();
    assert(registry.domain['module1/domain/user1']);
  });
});
