import bus from './bus';
import commandhandler from './command/handler';
import eventhandler from './event/handler';
import aggregate from './aggregate';
import app from './app';
import domain from './domain';
import utils from './utils';

export default {
  app,
  bus,
  domain,
  aggregate,
  'command':{commandhandler},
  'event':{eventhandler},
  utils
};
