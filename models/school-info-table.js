import Sequelize from "sequelize";

import { connectDB as connectSQLDB } from "../db/index.js";

var sequelize;

export class SQSchoolInfo extends Sequelize.Model {}

// Connects to database and creates the table.
export async function connectDB() {
	if (sequelize) return;
	sequelize = await connectSQLDB();
	SQSchoolInfo.init(
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
			modelName: "SQTransactionSupply",
		}
	);
	await SQSchoolInfo.sync();
}
