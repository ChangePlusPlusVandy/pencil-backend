import Sequelize from 'sequelize';

import { connectDB as connectSQLDB } from '../db/index.js';

let sequelize;

export class SQShoppingForm extends Sequelize.Model {}

// Connects to database and creates the table.
export async function connectDB() {
  if (sequelize) return;
  sequelize = await connectSQLDB();
  SQShoppingForm.init(
    {
      itemId: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
      },

      itemName: Sequelize.DataTypes.STRING,
      maxLimit: Sequelize.DataTypes.INTEGER,
      itemOrder: {
        type: Sequelize.DataTypes.INTEGER,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'SQShoppingForm',
    }
  );
  await SQShoppingForm.sync();
}
