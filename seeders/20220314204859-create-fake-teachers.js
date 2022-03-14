module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'teachers',
      [
        {
          pencilId: 1,
          firstName: 'Joel',
          lastName: 'Wright',
          email: 'joelwright@pencil.com',
          _schoolId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 2,
          firstName: 'Kevin',
          lastName: 'Jin',
          email: 'kevinjin@pencil.com',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 3,
          firstName: 'Intiser',
          lastName: 'Parash',
          email: 'intiserparash@pencil.com',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 4,
          firstName: 'Rafael',
          lastName: 'Voorhis-Allen',
          email: 'rafaelvoorhisallen@pencil.com',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 5,
          firstName: 'Arthur',
          lastName: 'Sung',
          email: 'arthursung@pencil.com',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 6,
          firstName: 'Catherine',
          lastName: 'Yang',
          email: 'catherineyang@pencil.com',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 7,
          firstName: 'Izzy',
          lastName: 'Hood',
          email: 'izzyhood@pencil.com',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 8,
          firstName: 'Kyle',
          lastName: 'Burgess',
          email: 'kyleburgess@pencil.com',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 9,
          firstName: 'Zi Nean',
          lastName: 'Teoh',
          email: 'zineanteoh@pencil.com',
          _schoolId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pencilId: 10,
          firstName: 'Juyoung',
          lastName: 'Kim',
          email: 'juyoungkim@pencil.com',
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
