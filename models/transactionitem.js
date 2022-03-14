const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TransactionItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Transaction, {
        foreignKey: 'transactionId',
      });
      this.hasOne(models.Item, {
        foreignKey: 'itemId',
      });
    }
  }
  TransactionItem.init(
    {
      maxLimit: DataTypes.INTEGER,
      amountTaken: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'TransactionItem',
    }
  );
  return TransactionItem;
};
