'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      name: 'Fulano',
      email: 'teste@teste.com',
      password: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlQHRlc3RlLmNvbSIsImlkIjoxLCJpYXQiOjE2MTEzNjEzMDUsImV4cCI6MTY0MjkxODkwNX0.zBx0nEJkp4npeQJyCeIcyHdf2BuPYdX67udZ4Xx2LHY',
      role: "hall",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Cidadão 2',
      email: 'pessoa@2.com',
      password: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBlc3NvYUAyLmNvbSIsImlkIjoyLCJpYXQiOjE2MTEzNjEzMDUsImV4cCI6MTY0MjkxODkwNX0.3wIJYX-vrEEGqs1s_udVMt8Dv9w69nvgRoDYKTB1Los',
      role: "cook",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
