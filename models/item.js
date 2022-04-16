const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Location, ShoppingFormItem, TransactionItem }) {
      this.hasMany(TransactionItem, {
        foreignKey: '_itemId',
      });

      this.hasMany(ShoppingFormItem, {
        foreignKey: '_itemId',
      });
    }

    toJSON() {
      return {
        ...this.get(),
        _id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };
    }
  }
  Item.init(
    {
      _id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      itemName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { message: 'Item name cannot be null' },
          notEmpty: { message: 'Item name cannot be empty' },
        },
      },
      itemPrice: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isNumeric: {
            message: 'Item price must be a number',
          },
          isValidPrice(val) {
            // allows numeric up to two decimals
            const regex = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
            if (!regex.test(val)) {
              throw new Error('Item price is invalid');
            }
          },
        },
      },
      archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'items',
      modelName: 'Item',
    }
  );
  return Item;
};
