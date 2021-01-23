'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ProductsOrders', [{
      order_id: 4,
      product_id: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      order_id: 4,
      product_id: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      order_id: 2,
      product_id: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      order_id: 1,
      product_id: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      order_id: 3,
      product_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      order_id: 1,
      product_id: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ProductsOrders', null, {});
  }
};
