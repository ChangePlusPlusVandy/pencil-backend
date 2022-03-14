module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('shopping_form_items', {
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
      maxLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { message: 'Max limit cannot be null' },
          notEmpty: { message: 'Max limit cannot be empty' },
          isNumeric: {
            message: 'Max limit must be a number',
          },
        },
      },
      itemOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { message: 'Item order cannot be null' },
          notEmpty: { message: 'Item order cannot be empty' },
          isNumeric: {
            message: 'Item order must be a number',
          },
        },
      },
      _itemId: {
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
    await queryInterface.dropTable('shopping_form_items');
  },
};
