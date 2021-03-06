module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('shopping_form_items', [
      {
        uuid: '2d551f0e-68c0-4gbd-9d19-7137817cc843',
        maxLimit: 30,
        itemOrder: 0,
        _itemId: 1,
        _locationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a80',
        maxLimit: 10,
        itemOrder: 1,
        _itemId: 2,
        _locationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a81',
        maxLimit: 20,
        itemOrder: 2,
        _itemId: 3,
        _locationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a82',
        maxLimit: 10,
        itemOrder: 3,
        _itemId: 4,
        _locationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a83',
        maxLimit: 10,
        itemOrder: 4,
        _itemId: 5,
        _locationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a84',
        maxLimit: 10,
        itemOrder: 5,
        _itemId: 6,
        _locationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a85',
        maxLimit: 10,
        itemOrder: 6,
        _itemId: 7,
        _locationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a86',
        maxLimit: 10,
        itemOrder: 7,
        _itemId: 8,
        _locationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a87',
        maxLimit: 10,
        itemOrder: 8,
        _itemId: 9,
        _locationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a88',
        maxLimit: 10,
        itemOrder: 9,
        _itemId: 10,
        _locationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a89',
        maxLimit: 10,
        itemOrder: 10,
        _itemId: 11,
        _locationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a90',
        maxLimit: 10,
        itemOrder: 11,
        _itemId: 12,
        _locationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a91',
        maxLimit: 10,
        itemOrder: 12,
        _itemId: 13,
        _locationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a92',
        maxLimit: 10,
        itemOrder: 13,
        _itemId: 14,
        _locationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a93',
        maxLimit: 10,
        itemOrder: 14,
        _itemId: 15,
        _locationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a94',
        maxLimit: 10,
        itemOrder: 0,
        _itemId: 7,
        _locationId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a95',
        maxLimit: 10,
        itemOrder: 1,
        _itemId: 8,
        _locationId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a96',
        maxLimit: 10,
        itemOrder: 2,
        _itemId: 9,
        _locationId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a97',
        maxLimit: 10,
        itemOrder: 3,
        _itemId: 10,
        _locationId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a98',
        maxLimit: 10,
        itemOrder: 4,
        _itemId: 11,
        _locationId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f25bc4a2-c511-4ba5-a5c2-f57576323a99',
        maxLimit: 10,
        itemOrder: 5,
        _itemId: 12,
        _locationId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('shopping_form_items', null, {});
  },
};
