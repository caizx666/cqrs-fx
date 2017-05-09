import mysql from 'mysql';

import config from '../config'; 

export default class {
  constructor( ) {
    this.pool = mysql.createPool(config.get('mysql'));
  }
};
