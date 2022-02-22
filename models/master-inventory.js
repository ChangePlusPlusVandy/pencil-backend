import Sequelize from 'sequelize';

import { connectDB as connectSQLDB } from '../db/index.js';

let sequelize;

export class SQMasterInventory extends Sequelize.Model {}

// Connects to database and creates the table.
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

      itemName: Sequelize.DataTypes.STRING,
      itemPrice: Sequelize.DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: 'SQMasterInventory',
    }
  );

  await SQMasterInventory.sync();
}

export async function connectSelectTable(name) {
  sequelize = await connectSQLDB();
  const newName = 'SQMasterInventory'.concat(name);
  SQMasterInventory.init(
    {
      itemId: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },

      itemName: Sequelize.DataTypes.STRING,
      itemPrice: Sequelize.DataTypes.DOUBLE,
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: newName,
    }
  );
  await SQMasterInventory.sync();
}
