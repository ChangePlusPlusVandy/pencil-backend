module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'transactions',
      [
        {
          uuid: '392413f5-77d9-4963-bea5-360f3e1f94c8',
          status: 0,
          _teacherId: 2,
          _schoolId: 2,
          _locationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '564399a6-ff03-464f-89b5-9ed82c7e214c',
          status: 0,
          _teacherId: 3,
          _schoolId: 2,
          _locationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '7fbcee32-acd0-4595-94c9-783a3fg978ee',
          status: 0,
          _teacherId: 4,
          _schoolId: 2,
          _locationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '7fbcee32-acd0-4595-94c9-783a3t5978ee',
          status: 0,
          _teacherId: 4,
          _schoolId: 2,
          _locationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '7fbcee32-acd0-4595-94c9-783a3w5978ee',
          status: 0,
          _teacherId: 4,
          _schoolId: 2,
          _locationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '7fbcee32-acd0-4595-94c9-783a3fg978ef',
          status: 0,
          _teacherId: 4,
          _schoolId: 2,
          _locationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '7fbcee32-acd0-4595-94c9-783a3f5s78ee',
          status: 0,
          _teacherId: 4,
          _schoolId: 2,
          _locationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '7fbcee32-acd0-4595-94c9-783a3a5978ee',
          status: 0,
          _teacherId: 4,
          _schoolId: 2,
          _locationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '7fbcee32-acd0-4595-94c9-783a3f5v78ee',
          status: 0,
          _teacherId: 4,
          _schoolId: 2,
          _locationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '7fbcee32-acd0-4595-94c9-78pa3f5f78ee',
          status: 0,
          _teacherId: 4,
          _schoolId: 2,
          _locationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '7fbcee32-acd0-4595-94c9-783adf5978ee',
          status: 0,
          _teacherId: 4,
          _schoolId: 2,
          _locationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '7fbcee32-acd0-4595-94c9-783aaf5978ee',
          status: 0,
          _teacherId: 4,
          _schoolId: 2,
          _locationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '7fbcee32-acd0-4595-94c9-c83a3f5978ee',
          status: 0,
          _teacherId: 4,
          _schoolId: 2,
          _locationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '7fbcee32-acd0-4595-94c9-78ia3f5978ee',
          status: 0,
          _teacherId: 4,
          _schoolId: 2,
          _locationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '7fbcee32-acd0-4595-94c9-7o3a3f5978ee',
          status: 0,
          _teacherId: 4,
          _schoolId: 2,
          _locationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '7fbcee32-acd0-4595-94c9-7p3a3f5978ee',
          status: 0,
          _teacherId: 4,
          _schoolId: 2,
          _locationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '7fbcee32-acd0-4595-94c9-c83a3f5978ee',
          status: 0,
          _teacherId: 4,
          _schoolId: 2,
          _locationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '7fbcee32-acd0-4595-94c9-783a3f2978ee',
          status: 0,
          _teacherId: 4,
          _schoolId: 2,
          _locationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('transactions', null, {});
  },
};
