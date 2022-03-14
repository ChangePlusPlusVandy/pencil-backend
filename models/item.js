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
      // this.belongsToMany(Location, {
      //   through: ShoppingForm,
      //   foreignKey: 'itemId',
      // });

      // this.belongsToMany(Transaction, {
      //   through: TransactionItem,
      //   foreignKey: 'itemId',
      // });
      this.hasMany(TransactionItem, {
        foreignKey: 'itemId',
      });

      this.hasMany(ShoppingForm, {
        foreignKey: 'itemId',
      });
    }

    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }
  Item.init(
    {
      itemName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { message: 'Item name cannot be null' },
          notEmpty: { message: 'Item name cannot be empty' },
        },
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      itemPrice: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: 'Item',
    }
  );
  return Item;
};
