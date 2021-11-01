
// import config from '../config/db.config.js'
// import mysql from 'mysql'

// const connection = mysql.createConnection({
//     host: config.HOST,
//     port: config.PORT,
//     user: config.USER,
//     password: config.PASSWORD,
//     database: config.DB
//   });

// connection.connect((err) => {
//   if (err) throw err;
//   console.log('Connected to db');
// });

// let pencildb = {};

// pencildb.all = () => {
//   return new Promise((resolve, reject) => {connection.query('SELECT * FROM pencildb', (err, results) => {
//     if (err) return  reject(err);
//     return resolve(results)
//   }
//   )});
// };

// export default pencildb;

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