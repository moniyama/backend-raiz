'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products', [{
      name: "café",
      price: 5.50,
      flavor: null,
      complement: null,
      image: "url do cafe",
      type: 'breakfast',
      sub_type: 'breakfast',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "hambuguer duplo",
      price: 15.99,
      flavor: "vegetariano", 
      complement: "ovo",
      image: "url do h duplo",
      type: "breakfast",
      sub_type: "hamburguer",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "hambuguer simples",
      price: 15.99,
      flavor: "frango", 
      complement: "ovo e queijo",
      image: "url do h duplo",
      type: "breakfast",
      sub_type: "hamburguer",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "batata frita",
      price: 7,
      flavor: null,
      complement: null,
      image: "url da batata",
      type: "breakfast",      // não roda o seed se deixar lunch
      sub_type: "side",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "suco",
      price: 5.00,
      flavor: null,
      complement: null,
      image: "url do cafe",
      type: "breakfast",
      sub_type: 'drinks',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
