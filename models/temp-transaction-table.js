import Sequelize from 'sequelize';

import { connectDB as connectSQLDB } from '../db/index.js';

let sequelize;

export class SQTempTransaction extends Sequelize.Model {}

// Connects to database and creates the table.
export async function connectDB() {
  if (sequelize) return;
  sequelize = await connectSQLDB();
  SQTempTransaction.init(
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
      sequelize,
      modelName: 'SQTempTransaction',
    }
  );
  await SQTempTransaction.sync();
}

export async function connectSelectTable(name) {
  sequelize = await connectSQLDB();
  const newName = 'SQTempTransaction'.concat(name);
  SQTempTransaction.init(
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
      freezeTableName: true,
      sequelize,
      modelName: newName,
    }
  );
  await SQTempTransaction.sync();
}
