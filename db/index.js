
import config from '../config/db.config.js'
import mysql from 'mysql'

const connection = mysql.createPool({
    host: config.HOST,
    port: config.PORT,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DB
  });

// connection.connect((err) => {
//   if (err) throw err;
//   console.log('Connected to db');
// });

let pencildb = {};

pencildb.all = () => {
  return new Promise((resolve, reject) => {connection.query('SELECT * FROM pencildb', (err, results) => {
    if (err) return  reject(err);
    return resolve(results)
  }
  )});
};

export default pencildb;