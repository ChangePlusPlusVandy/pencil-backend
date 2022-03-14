const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class School extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Teacher, {
        foreignKey: 'schoolId',
      });
      this.hasMany(models.Transaction, {
        foreignKey: 'schoolId',
      });
    }

    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }
  School.init(
    {
      name: DataTypes.STRING,
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: 'School',
    }
  );
  return School;
};
