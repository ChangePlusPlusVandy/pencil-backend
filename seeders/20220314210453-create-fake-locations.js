module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'locations',
      [
        {
          uuid: '2d551f0e-68c0-4cbd-9d19-7137817cc843',
          name: 'Nashville',
          address: '7199 Cockrill Bend Blvd, Nashville, TN 37209',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a80',
          name: 'Antioch',
          address: '7200 Cockrill Bend Blvd, Nashville, TN 37209',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('locations', null, {});
  },
};
