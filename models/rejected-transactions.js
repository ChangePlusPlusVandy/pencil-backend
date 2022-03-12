import Sequelize from 'sequelize';

import { connectDB as connectSQLDB } from '../db/index.js';

let sequelize;

export class SQRejectedTransactions extends Sequelize.Model {}

export async function connectSelectTable(name) {
  sequelize = await connectSQLDB();
  const newName = 'SQRejectedTransactions'.concat(name);
  SQRejectedTransactions.init(
    {
      transactionId: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },

      teacherId: Sequelize.DataTypes.INTEGER,
      schoolId: Sequelize.DataTypes.INTEGER,
      items: Sequelize.DataTypes.JSON,
    },
    {
      freezeTableName: true,
      sequelize,
      modelName: newName,
    }
  );
  await SQRejectedTransactions.sync();
}
