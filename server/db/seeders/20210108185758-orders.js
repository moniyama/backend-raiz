'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Orders', [{
      client_name: 'Cliente 1',
      user_id: 1,
      table: 3,
      status: "pending",
      createdAt: new Date(),
      processedAt: null,
      updatedAt: new Date()
    },
    {
      client_name: 'Cliente 2',
      user_id: 2,
      table: 5,
      status: "canceled",
      createdAt: new Date(),
      processedAt: null,
      updatedAt: new Date()
    },
    {
      client_name: 'Cliente 3',
      user_id: 2,
      table: 8,
      status: "delivering",
      createdAt: new Date(),
      processedAt: null,
      updatedAt: new Date()
    },
    {
      client_name: 'Cliente 4',
      user_id: 1,
      table: 1,
      status: "delivered",
      createdAt: new Date(),
      processedAt: null,
      updatedAt: new Date()
    },
    {
      client_name: 'Cliente 5',
      user_id: 3,
      table: 1,
      status: "delivered",
      createdAt: new Date(),
      processedAt: null,
      updatedAt: new Date()
    },
    {
      client_name: 'Cliente 6',
      user_id: 3,
      table: 4,
      status: "delivered",
      createdAt: new Date(),
      processedAt: null,
      updatedAt: new Date()
    },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Orders', null, {});
  }
};
