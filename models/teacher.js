const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Teacher.init(
    {
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Teacher',
    }
  );
  return Teacher;
};
