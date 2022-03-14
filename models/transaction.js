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
      this.belongsToMany(models.Item, {
        through: 'TransactionItem',
        foreignKey: 'transactionId',
      });
    }
  }
  Transaction.init(
    {
      items: DataTypes.JSON,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Transaction',
    }
  );
  return Transaction;
};
