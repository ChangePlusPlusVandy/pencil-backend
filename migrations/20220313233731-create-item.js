module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('items', {
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
      itemName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { message: 'Item name cannot be null' },
          notEmpty: { message: 'Item name cannot be empty' },
        },
      },
      itemPrice: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isNumeric: {
            message: 'Item price must be a number',
          },
          isValidPrice(val) {
            // allows numeric up to two decimals
            const regex = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
            if (!regex.test(val)) {
              throw new Error('Item price is invalid');
            }
          },
        },
      },
      archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable('items');
  },
};
