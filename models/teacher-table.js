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
      teacherkey: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },

      firstName: Sequelize.DataTypes.STRING,
      lastName: Sequelize.DataTypes.STRING,
      email: Sequelize.DataTypes.STRING,
      phone: Sequelize.DataTypes.STRING,
      schoolId: Sequelize.DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'SQTeacher',
    }
  );
  await SQTeacher.sync();
}
