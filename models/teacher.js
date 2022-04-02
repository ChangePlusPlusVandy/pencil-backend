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
        foreignKey: '_schoolId',
      });
      this.hasMany(models.Transaction, {
        foreignKey: '_teacherId',
      });
      this.hasMany(models.ScheduleItem, {
        foreignKey: '_teacherId',
      });
    }

    toJSON() {
      return {
        ...this.get(),
        _id: undefined,
        _schoolId: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };
    }
  }
  Teacher.init(
    {
      _id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      pencilId: {
        type: DataTypes.INTEGER,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { message: 'Email cannot be null' },
          notEmpty: { message: 'Email cannot be empty' },
          isEmail: { message: 'Email must be valid' },
        },
      },
      phone: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
    },
    {
      sequelize,
      tableName: 'teachers',
      modelName: 'Teacher',
    }
  );
  return Teacher;
};
