import Sequelize from 'sequelize';
// eslint-disable-next-line import/no-unresolved
import config from '../config/db.config.js';

let sqldb;

/**
 * Populates teacher information in state.
 * @return {Object} -SQL database to parse.
 * */
export async function connectDB() {
  if (typeof sqldb === 'undefined') {
    sqldb = new Sequelize(config.DB, config.USER, config.PASSWORD, {
      host: config.HOST,
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
    });
    await sqldb.authenticate();
  }
  return sqldb;
}

// Closes the connection to the database.
export async function close() {
  if (sqldb) sqldb.close();
  sqldb = undefined;
}
