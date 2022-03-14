const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.shoppingForm, {
        foreignKey: 'itemId',
      });

      this.belongsToMany(models.transactionItem, {
        foreignKey: 'itemId',
      });
    }
  }
  Item.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
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
