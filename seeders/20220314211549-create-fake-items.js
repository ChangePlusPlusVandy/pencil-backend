module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('items', [
      {
        uuid: '2d551f0e-68c0-4cbd-9d19-7137817cc843',
        itemName: 'Pencil',
        itemPrice: '1.00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a80',
        itemName: 'Eraser',
        itemPrice: '0.50',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a81',
        itemName: 'Pen',
        itemPrice: '0.75',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a82',
        itemName: 'Backpack',
        itemPrice: '5.00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a83',
        itemName: 'Notebook',
        itemPrice: '2.00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a84',
        itemName: 'Calculator',
        itemPrice: '3.00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a85',
        itemName: 'Ruler',
        itemPrice: '0.25',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a86',
        itemName: 'Pencil Case',
        itemPrice: '0.25',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a87',
        itemName: 'Pencil Sharpener',
        itemPrice: '0.25',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a88',
        itemName: 'Computer',
        itemPrice: '100.00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a89',
        itemName: 'Laptop',
        itemPrice: '200.00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a90',
        itemName: 'Lamp',
        itemPrice: '10.00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a91',
        itemName: 'Book',
        itemPrice: '5.00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a92',
        itemName: 'Tissues',
        itemPrice: '0.50',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a93',
        itemName: 'Paper Towels',
        itemPrice: '0.50',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('items', null, {});
  },
};
