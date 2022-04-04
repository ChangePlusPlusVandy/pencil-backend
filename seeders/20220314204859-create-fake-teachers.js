module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'teachers',
      [
        {
          pencilId: 1,
          name: 'Joel Wright',
          email: 'joelwright@pencil.com',
          phone: '+1 123-456-7890',
          _schoolId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 2,
          name: 'Kevin Jin',
          email: 'kevinjin@pencil.com',
          phone: '+1 123-456-7890',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 3,
          name: 'Intiser Parash',
          email: 'intiserparash@pencil.com',
          phone: '+1 123-456-7890',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 4,
          name: 'Rafael Voorhis-Allen',
          email: 'rafaelvoorhisallen@pencil.com',
          phone: '+1 123-456-7890',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 5,
          name: 'Arthur Sung',
          email: 'arthursung@pencil.com',
          phone: '+1 123-456-7890',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 6,
          name: 'Catherine Yang',
          email: 'catherineyang@pencil.com',
          phone: '+1 123-456-7890',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 7,
          name: 'Izzy Hood',
          email: 'izzyhood@pencil.com',
          phone: '+1 123-456-7890',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 8,
          name: 'Kyle Burgess',
          email: 'kyleburgess@pencil.com',
          phone: '+1 123-456-7890',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 9,
          name: 'Zi Nean Teoh',
          email: 'zineanteoh@pencil.com',
          phone: '+1 123-456-7890',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 10,
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
