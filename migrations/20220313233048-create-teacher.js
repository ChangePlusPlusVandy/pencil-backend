module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('teachers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      pencilId: {
        type: DataTypes.INTEGER,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
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
      schoolId: {
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
    await queryInterface.dropTable('teachers');
  },
};
