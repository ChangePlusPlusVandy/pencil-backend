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
      this.belongsTo(models.School, {
        foreignKey: 'schoolId',
      });
      this.hasMany(models.Transaction, {
        foreignKey: 'teacherId',
      });
    }
  }
  Teacher.init(
    {
      pencilId: DataTypes.INTEGER,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
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
