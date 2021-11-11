import Sequelize from "sequelize";

import { connectDB as connectSQLDB } from "../db/index.js";

var sequelize;

export class SQTransactionSupply extends Sequelize.Model {}

// Connects to database and creates the table.
export async function connectDB() {
	if (sequelize) return;
	sequelize = await connectSQLDB();
	SQTransactionSupply.init(
		{
			transactionId: {
				type: Sequelize.DataTypes.INTEGER,
				primaryKey: true,
				unique: true,
			},

			item1: Sequelize.DataTypes.INTEGER,
			item2: Sequelize.DataTypes.INTEGER,
			item3: Sequelize.DataTypes.INTEGER,
			phone: Sequelize.DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "SQTransactionSupply",
		}
	);
	await SQTransactionSupply.sync();
}
