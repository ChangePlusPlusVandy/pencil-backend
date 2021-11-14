import Sequelize from "sequelize";

import { connectDB as connectSQLDB } from "../db/index.js";

var sequelize;

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
			time: Sequelize.DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "SQTransaction",
		}
	);
	await SQTransaction.sync();
}
