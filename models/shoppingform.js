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
