module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('teachers', {
      _id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      pencilId: {
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        required: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { message: 'Email cannot be null' },
          notEmpty: { message: 'Email cannot be empty' },
          isEmail: { message: 'Email must be valid' },
        },
      },
      phone: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      _schoolId: {
        type: DataTypes.INTEGER,
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
    await queryInterface.dropTable('teachers');
  },
};
