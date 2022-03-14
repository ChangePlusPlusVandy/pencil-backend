const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Location, {
        foreignKey: 'locationId',
      });
      this.belongsTo(models.Teacher, {
        foreignKey: 'teacherId',
      });
      this.belongsTo(models.School, {
        foreignKey: 'schoolId',
      });
      this.hasMany(models.TransactionItem, {
        foreignKey: 'transactionId',
      });
    }
  }
  Transaction.init(
    {
      status: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: 'Transaction',
    }
  );
  return Transaction;
};
