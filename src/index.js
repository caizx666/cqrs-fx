'use strict';

import commandhandler from './command/handler';
import eventhandler from './event/handler';
import aggregate from './aggregate';
import app from './app';
import domain from './domain';
import utils from './utils';

export default {
  app,
  domain,
  aggregate,
  command:{handler},
  event:{handler},
  utils
};
