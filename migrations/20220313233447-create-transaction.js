module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      teacherId: {
        type: DataTypes.INTEGER,
      },
      schoolId: {
        type: DataTypes.INTEGER,
      },
      locationId: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('Transactions');
  },
};
