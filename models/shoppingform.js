const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ShoppingForm extends Model {
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
      this.belongsTo(models.Item, {
        foreignKey: 'itemId',
      });
    }

    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }
  ShoppingForm.init(
    {
      maxLimit: DataTypes.INTEGER,
      itemOrder: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'ShoppingForm',
    }
  );
  return ShoppingForm;
};
