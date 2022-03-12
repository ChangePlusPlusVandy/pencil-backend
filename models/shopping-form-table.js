import Sequelize from 'sequelize';

import { connectDB as connectSQLDB } from '../db/index.js';

let sequelize;

export class SQShoppingForm extends Sequelize.Model {}

export async function connectSelectTable(name) {
  sequelize = await connectSQLDB();
  const newName = 'SQShoppingForm'.concat(name);
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
      freezeTableName: true,
      modelName: newName,
    }
  );
  await SQShoppingForm.sync();
}
