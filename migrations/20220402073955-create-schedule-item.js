module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('schedule_items', {
      _id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      showed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      _scheduleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      _teacherId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('schedule_items');
  },
};
