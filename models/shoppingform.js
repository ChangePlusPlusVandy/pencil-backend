const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ShoppingFormItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Location, Item }) {
      // define association here
      this.belongsTo(Location, {
        foreignKey: '_locationId',
      });
      this.belongsTo(Item, {
        foreignKey: '_itemId',
      });
    }

    toJSON() {
      return {
        ...this.get(),
        _id: undefined,
        _locationId: undefined,
        _itemId: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };
    }
  }
  ShoppingFormItem.init(
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
      maxLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { message: 'Max limit cannot be null' },
          notEmpty: { message: 'Max limit cannot be empty' },
          isNumeric: {
            message: 'Max limit must be a number',
          },
        },
      },
      itemOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { message: 'Item order cannot be null' },
          notEmpty: { message: 'Item order cannot be empty' },
          isNumeric: {
            message: 'Item order must be a number',
          },
        },
      },
    },
    {
      sequelize,
      tableName: 'shopping_form_items',
      modelName: 'ShoppingFormItem',
    }
  );
  return ShoppingFormItem;
};
