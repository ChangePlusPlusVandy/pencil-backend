module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'schools',
      [
        {
          uuid: '79e1fc58-3062-4a48-8e21-abb5722eaf93',
          name: 'Pencil Warehouse High School',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '15fe73de-f4b9-4342-ac53-d6be0026c6c0',
          name: 'Vanderbilt University',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '9b8101e1-6405-433a-9cdc-f7083fc8f265',
          name: 'ChangePlusPlus Mentor Preparatory School',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('schools', null, {});
  },
};
