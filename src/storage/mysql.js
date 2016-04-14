import mysql from 'mysql';
import config from '../config';

export default new class{
  constructor(){
    let mysqlConfig = config.get('mysql');
    this.pool  = mysql.createPool(mysqlConfig);
  } 
}
