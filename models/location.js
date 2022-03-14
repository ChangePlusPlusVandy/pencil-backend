const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ ShoppingFormItem, Transaction }) {
      // define association here
      this.hasMany(Transaction, {
        foreignKey: '_locationId',
      });

      this.hasMany(ShoppingFormItem, {
        foreignKey: '_locationId',
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
  Location.init(
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
      address: { type: DataTypes.STRING, defaultValue: '' },
    },
    {
      sequelize,
      tableName: 'locations',
      modelName: 'Location',
    }
  );
  return Location;
};
