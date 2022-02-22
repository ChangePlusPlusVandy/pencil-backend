import Sequelize from 'sequelize';

import { connectDB as connectSQLDB } from '../db/index.js';

let sequelize;

export class SQTransaction extends Sequelize.Model {}

// Connects to database and creates the table.
export async function connectDB() {
  if (sequelize) return;
  sequelize = await connectSQLDB();
  SQTransaction.init(
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
  await SQTransaction.sync();
}

export async function connectSelectTable(name) {
  sequelize = await connectSQLDB();
  const newName = 'SQTransaction'.concat(name);
  SQTransaction.init(
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
  await SQTransaction.sync();
}
