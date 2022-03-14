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
        foreignKey: 'locationId',
      });
      this.belongsTo(models.Teacher, {
        foreignKey: 'teacherId',
      });
      this.belongsTo(models.School, {
        foreignKey: 'schoolId',
      });
      this.hasMany(models.TransactionItem, {
        foreignKey: 'transactionId',
      });
    }

    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        locationId: undefined,
        teacherId: undefined,
        schoolId: undefined,
      };
    }
  }
  Transaction.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      status: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: 'Transaction',
    }
  );
  return Transaction;
};
