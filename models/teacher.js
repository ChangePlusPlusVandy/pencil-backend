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

    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        schoolId: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };
    }
  }
  Teacher.init(
    {
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
