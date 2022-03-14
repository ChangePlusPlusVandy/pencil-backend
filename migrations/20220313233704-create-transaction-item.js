module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('transaction_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      maxLimit: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      amountTaken: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      transactionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('transaction_items');
  },
};
