const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Location, {
        foreignKey: '_locationId',
      });
      this.belongsTo(models.Teacher, {
        foreignKey: '_teacherId',
      });
      this.belongsTo(models.School, {
        foreignKey: '_schoolId',
      });
      this.hasMany(models.TransactionItem, {
        foreignKey: '_transactionId',
      });
    }

    toJSON() {
      return {
        ...this.get(),
        _id: undefined,
        _locationId: undefined,
        _teacherId: undefined,
        _schoolId: undefined,
        updatedAt: undefined,
      };
    }
  }
  Transaction.init(
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
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          isIn: {
            args: [[0, 1, 2]],
            msg: 'Status must be 0, 1, or 2',
          },
        },
      },
    },
    {
      sequelize,
      tableName: 'transactions',
      modelName: 'Transaction',
    }
  );
  return Transaction;
};
