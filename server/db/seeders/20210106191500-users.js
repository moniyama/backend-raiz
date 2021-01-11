'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      name: 'Fulano',
      email: 'teste@teste.com',
      password: 'hash',
      admin: true,
      role: "hall",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Cidadão 2',
      email: 'pessoa@2.com',
      password: 'hashzona',
      admin: false,
      role: "cook",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
