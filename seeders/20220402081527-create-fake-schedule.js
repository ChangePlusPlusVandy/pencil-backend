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
          start_date: new Date(new Date().getTime() + 900000),
          end_date: new Date(new Date().getTime() + 1800000),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _locationId: 1,
          start_date: new Date(new Date().getTime() + 1800000),
          end_date: new Date(new Date().getTime() + 2700000),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _locationId: 1,
          start_date: new Date(new Date().getTime() + 2700000),
          end_date: new Date(new Date().getTime() + 3600000),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _locationId: 1,
          start_date: new Date(new Date().getTime() + 3600000),
          end_date: new Date(new Date().getTime() + 4500000),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _locationId: 1,
          start_date: new Date(new Date().getTime() + 4500000),
          end_date: new Date(new Date().getTime() + 5400000),
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
