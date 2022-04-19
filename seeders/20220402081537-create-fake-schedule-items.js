module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'schedule_items',
      [
        {
          _scheduleId: 1,
          _teacherId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _scheduleId: 1,
          _teacherId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _scheduleId: 1,
          _teacherId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _scheduleId: 1,
          _teacherId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _scheduleId: 1,
          _teacherId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _scheduleId: 2,
          _teacherId: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _scheduleId: 2,
          _teacherId: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _scheduleId: 3,
          _teacherId: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _scheduleId: 4,
          _teacherId: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _scheduleId: 5,
          _teacherId: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('schedule_items', null, {});
  },
};
