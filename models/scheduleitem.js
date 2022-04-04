const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ScheduleItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Schedule, {
        foreignKey: '_scheduleId',
      });
      this.belongsTo(models.Teacher, {
        foreignKey: '_teacherId',
      });
    }
  }
  ScheduleItem.init(
    {
      _id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: 'schedule_items',
      modelName: 'ScheduleItem',
    }
  );
  return ScheduleItem;
};
