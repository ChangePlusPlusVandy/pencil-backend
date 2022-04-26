module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'teachers',
      [
        {
          pencilId: 91,
          name: 'Joel Wright',
          email: 'joelwright@pencil.com',
          phone: '+1 123-456-7890',
          _schoolId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 92,
          name: 'Kevin Jin',
          email: 'kevinjin@pencil.com',
          phone: '+1 123-456-7890',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 93,
          name: 'Intiser Parash',
          email: 'intiserparash@pencil.com',
          phone: '+1 123-456-7890',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 94,
          name: 'Rafael Voorhis-Allen',
          email: 'rafaelvoorhisallen@pencil.com',
          phone: '+1 123-456-7890',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 95,
          name: 'Arthur Sung',
          email: 'arthursung@pencil.com',
          phone: '+1 123-456-7890',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 96,
          name: 'Catherine Yang',
          email: 'catherineyang@pencil.com',
          phone: '+1 123-456-7890',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 97,
          name: 'Izzy Hood',
          email: 'izzyhood@pencil.com',
          phone: '+1 123-456-7890',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 98,
          name: 'Kyle Burgess',
          email: 'kyleburgess@pencil.com',
          phone: '+1 123-456-7890',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 99,
          name: 'Zi Nean Teoh',
          email: 'zineanteoh@pencil.com',
          phone: '+1 123-456-7890',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 100,
          name: 'Juyoung Kim',
          email: 'juyoungkim@pencil.com',
          phone: '+1 123-456-7890',
          _schoolId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('teachers', null, {});
  },
};
