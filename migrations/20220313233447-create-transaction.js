module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('transactions', {
      _id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          isIn: {
            args: [[0, 1, 2]],
            msg: 'Status must be 0, 1, or 2',
          },
        },
      },
      _teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      _schoolId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      _locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('transactions');
  },
};
