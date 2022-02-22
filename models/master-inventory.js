import Sequelize from 'sequelize';

import { connectDB as connectSQLDB } from '../db/index.js';

let sequelize;

export class SQMasterInventory extends Sequelize.Model {}

// Connects to database and creates the table.
export async function connectDB() {
  if (sequelize) return;
  sequelize = await connectSQLDB();
  
  console.log("BEFORE THINGY")
  SQMasterInventory.init(
    {
      itemId: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },

      itemName: Sequelize.DataTypes.STRING,
      itemPrice: Sequelize.DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'SQMasterInventory',
    }
  );

  console.log("AFTER THE INIT")

  
  await SQMasterInventory.sync();
}