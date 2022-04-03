module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'schedules',
      [
        {
          _locationId: 1,
          start_date: new Date(),
          end_date: new Date(new Date().getTime() + 900000),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _locationId: 1,
          start_date: new Date(),
          end_date: new Date(new Date().getTime() + 900000),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _locationId: 2,
          start_date: new Date(),
          end_date: new Date(new Date().getTime() + 900000),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('schedules', null, {});
  },
};
