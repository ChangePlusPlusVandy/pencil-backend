import Sequelize from 'sequelize';

import { connectDB as connectSQLDB } from '../db/index.js';

let sequelize;

export class SQRejectedTransactions extends Sequelize.Model {}

export async function connectDB() {
  if (sequelize) return;
  sequelize = await connectSQLDB();
  
  SQRejectedTransactions.init(
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
      modelName: 'SQTransaction',
    }
  );
  
  await SQRejectedTransaction.sync();
}