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
        foreignKey: 'locationId',
      });
      this.belongsTo(Item, {
        foreignKey: 'itemId',
      });
    }

    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        locationId: undefined,
        itemId: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };
    }
  }
  ShoppingFormItem.init(
    {
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
