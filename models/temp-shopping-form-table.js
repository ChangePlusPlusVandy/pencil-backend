import Sequelize from 'sequelize';

import { 
    connectDB as connectSQLDB
} from '../db/index.js';

var sequelize;

export class SQSupplyForm extends Sequelize.Model {}


// Connects to database and creates the table.
export async function connectDB() {
    if (sequelize) return;
    sequelize = await connectSQLDB();
    SQSupplyForm.init({
        item_id: Sequelize.DataTypes.STRING, 
        item_name: Sequelize.DataTypes.STRING, 
        max_limit: Sequelize.DataTypes.STRING,
				order: {type: Sequelize.DataTypes.STRING,
					primaryKey: true, unique: true },
    }, {
        sequelize,
        modelName: 'SQSupplyForm'
    });
    await SQSupplyForm.sync();
}