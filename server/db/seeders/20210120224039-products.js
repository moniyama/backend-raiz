'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products', [{
      name: "café",
      price: 5.50,
      image: "url do cafe",
      type: 'breakfast',
      subitem: 'breakfast',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "hambuguer duplo",
      price: 15.99,
      image: "url do h duplo",
      type: "breakfast",
      subitem: "hamburguer",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "batata frita",
      price: 7,
      image: "url da batata",
      type: "breakfast",      // não roda o seed se deixar lunch
      subitem: "side",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "suco",
      price: 5.00,
      image: "url do cafe",
      type: "breakfast",
      subitem: 'drinks',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
