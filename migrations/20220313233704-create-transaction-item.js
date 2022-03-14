module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('transaction_items', {
      _id: {
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
      _transactionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      _itemId: {
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
    await queryInterface.dropTable('transaction_items');
  },
};
