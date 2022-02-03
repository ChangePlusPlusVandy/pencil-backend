import Sequelize from 'sequelize';

import { connectDB as connectSQLDB } from '../db/index.js';

let sequelize;

export class SQDeniedTransaction extends Sequelize.Model {}

// Connects to database and creates the table.
export async function connectDB() {
  if (sequelize) return;
  sequelize = await connectSQLDB();
  SQDeniedTransaction.init(
    {
      transactionId: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
      },

      teacherId: Sequelize.DataTypes.INTEGER,
      schoolId: Sequelize.DataTypes.INTEGER,
      items: Sequelize.DataTypes.JSON,
    },
    {
      sequelize,
      modelName: 'SQDeniedTransaction',
    }
  );
  await SQDeniedTransaction.sync();
}
