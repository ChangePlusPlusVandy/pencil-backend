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
        foreignKey: '_schoolId',
      });
      this.hasMany(models.Transaction, {
        foreignKey: '_schoolId',
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
  School.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { message: 'Name cannot be null' },
          notEmpty: { message: 'Name cannot be empty' },
        },
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: 'schools',
      modelName: 'School',
    }
  );
  return School;
};
