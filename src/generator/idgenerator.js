'use strict';

import uuid from 'node-uuid';

export default class{
  get generate(){
    return uuid.v4();
  }
}
