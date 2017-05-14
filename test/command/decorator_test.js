import {assert} from 'chai';
import * as decorator from '../../src/command/decorator';
import {fxData} from '../../src/core';
import path from 'path';

debugger

@decorator.module('module1')
class Tetst1 {
  @decorator.command('module3')
  do1() {}

  @decorator.command('module2/name2')
  do2() {}

  @decorator.command('module2', 'name2')
  do3() {}
}

describe('decorator', function() {
  it('标记一个类或者是方法上', function() {
    let dec = decorator.getDecoratorToken(Tetst1)
    assert.equal(dec.module, 'module1');
    assert.equal(dec.name, null);

    dec = decorator.getDecoratorToken(Tetst1.prototype.do1);
    assert.equal(dec.module, 'module3');
    assert.equal(dec.name, null);

    dec = decorator.getDecoratorToken(Tetst1.prototype.do2);
    assert.equal(dec.module, 'module2');
    assert.equal(dec.name, 'name2');

    dec = decorator.getDecoratorToken(Tetst1.prototype.do3);
    assert.equal(dec.module, 'module2');
    assert.equal(dec.name, 'name2');

  });

});
