module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('ShoppingForms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      maxLimit: {
        type: DataTypes.INTEGER,
      },
      itemOrder: {
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
    await queryInterface.dropTable('ShoppingForms');
  },
};
