import Sequelize from "sequelize";

import { connectDB as connectSQLDB } from "../db/index.js";

var sequelize;

export class SQSchool extends Sequelize.Model {}

// Connects to database and creates the table.
export async function connectDB() {
	if (sequelize) return;
	sequelize = await connectSQLDB();
	SQSchool.init(
		{
			schoolId: {
				type: Sequelize.DataTypes.INTEGER,
				primaryKey: true,
				unique: true,
			},

			schoolName: Sequelize.DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "SQSchool",
		}
	);
	await SQSchool.sync();
}
