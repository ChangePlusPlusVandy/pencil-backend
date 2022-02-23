import Sequelize from 'sequelize';

import { connectDB as connectSQLDB } from '../db/index.js';

let sequelize;

export class SQTeacher extends Sequelize.Model {}

// Connects to database and creates the table.
export async function connectDB() {
  if (sequelize) return;
  sequelize = await connectSQLDB();
  SQTeacher.init(
    {
      teacherId: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      firstName: Sequelize.DataTypes.STRING,
      lastName: Sequelize.DataTypes.STRING,
      email: Sequelize.DataTypes.STRING,
      phone: Sequelize.DataTypes.STRING,
      school: Sequelize.DataTypes.STRING, // CHANGE THIS TO SCHOOLID MAYBE
    },
    {
      sequelize,
      modelName: 'SQTeacher',
    }
  );
  await SQTeacher.sync();
}
