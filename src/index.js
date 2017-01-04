import bus from './bus';
import commandhandler from './command/handler';
import eventhandler from './event/handler';
import aggregate from './aggregate';
import app from './app';

export default {
  app,
  bus,
  aggregate,
  commandhandler,
  eventhandler
};
