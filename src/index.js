import bus from './bus';
import commandhandler from './command/handler';
import eventhandler from './event/handler';
import aggregate from './aggregate';
import app from './app';
import {alias,_require} from './core';
import {register,registry} from './register';

export default {
  alias,
  require:_require,
  register,
  registry,

  app,
  bus,
  aggregate,
  commandhandler,
  eventhandler
};
