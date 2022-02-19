import Sequelize from 'sequelize';

import { connectDB as connectSQLDB } from '../db/index.js';

let sequelize;

export class SQMasterInventory extends Sequelize.Model {}

export async function connectDB() {
  if (sequelize) return;
  sequelize = await connectSQLDB();

  SQMasterInventory.init(
    {
      itemId: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },

      itemName: sequelize.DataTypes.STRING,
      itemPrice: sequelize.DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: 'SQMasterInventory',
    }
  );
  
  await SQMasterInventory.sync();
}