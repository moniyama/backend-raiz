'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Orders', [{
      client_name: 'Cliente 1',
      table: 3,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      client_name: 'Cliente 2',
      table: 5,
      status: "canceled",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      client_name: 'Cliente 3',
      table: 8,
      status: "delivering",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      client_name: 'Cliente 4',
      table: 1,
      status: "delivered",
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Orders', null, {});
  }
};
