'use strict';

export default class entity {
  constructor(id){
    this.id = id || null;
  }

  id(id){
    if (!id)
      return this.id;
    this.id = id;
  }
}
