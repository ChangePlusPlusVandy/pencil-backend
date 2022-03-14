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
        foreignKey: '_transactionId',
      });
      this.belongsTo(models.Item, {
        foreignKey: '_itemId',
      });
    }

    toJSON() {
      return {
        ...this.get(),
        _id: undefined,
        _transactionId: undefined,
        _itemId: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };
    }
  }
  TransactionItem.init(
    {
      _id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
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
