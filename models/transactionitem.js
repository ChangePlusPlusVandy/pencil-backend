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
      this.belongsTo(models.Item, {
        foreignKey: 'itemId',
      });
    }

    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        transactionId: undefined,
        itemId: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };
    }
  }
  TransactionItem.init(
    {
      maxLimit: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      amountTaken: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'transaction_items',
      modelName: 'TransactionItem',
    }
  );
  return TransactionItem;
};
