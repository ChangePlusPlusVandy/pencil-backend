import Sequelize from 'sequelize';

import { connectDB as connectSQLDB } from '../db/index.js';

let sequelize;

export class SQLocation extends Sequelize.Model {}

// Connects to database and creates the table.
export async function connectDB() {
  if (sequelize) return;
  sequelize = await connectSQLDB();
  SQLocation.init(
    {
      name: Sequelize.DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'SQLocation',
    }
  );
  await SQLocation.sync();
}
