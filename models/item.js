const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Location, ShoppingForm, TransactionItem, Transaction }) {
      // define association here
      this.belongsToMany(Location, {
        through: ShoppingForm,
        foreignKey: 'shoppingFormId',
      });

      this.belongsToMany(Transaction, {
        through: TransactionItem,
        foreignKey: 'transactionItemId',
      });
    }
  }
  Item.init(
    {
      itemName: DataTypes.STRING,
      itemPrice: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: 'Item',
    }
  );
  return Item;
};
