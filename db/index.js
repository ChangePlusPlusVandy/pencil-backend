import config from '../config/db.config.js'
import Sequelize from 'sequelize'

var sqldb

export async function connectDB() {
  if(typeof sqldb === 'undefined') {
    sqldb = new Sequelize(config.DB, config.USER, config.PASSWORD, {
      host: config.HOST,
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    })
    await sqldb.authenticate()
  }
  return sqldb
}

export async function close() {
  if (sqldb) sqldb.close();
  sqldb = undefined;
}