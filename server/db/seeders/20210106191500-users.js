'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      name: 'Fulano 1',
      email: 'usuario1@teste.com',
      password: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlQHRlc3RlLmNvbSIsImlkIjoxLCJpYXQiOjE2MTEzNjEzMDUsImV4cCI6MTY0MjkxODkwNX0.zBx0nEJkp4npeQJyCeIcyHdf2BuPYdX67udZ4Xx2LHY',
      role: "hall",
      restaurant: "one",
      createdAt: new Date(),
      updatedAt: new Date()
    }, 
    {
      name: 'Fulano 2',
      email: 'usuario2@teste.com',
      password: '$2a$12$oqIIobt0vrBt836RoAD3m.r6UX.ynU2dS0ttFZU5gwyWL4GdC1NEa',
      role: "cook",
      restaurant: "one",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Cidadão 1',
      email: 'usuario3@teste.com',
      password: '$2a$12$uDwsKdYbdflacFbQV.xsluECEJ0utJV3G4gdU3Bwx1fllakLVhd3e',
      role: "hall",
      restaurant: "two",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Cidadão 2',
      email: 'usuario4@teste.com',
      password: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBlc3NvYUAyLmNvbSIsImlkIjoyLCJpYXQiOjE2MTEzNjEzMDUsImV4cCI6MTY0MjkxODkwNX0.3wIJYX-vrEEGqs1s_udVMt8Dv9w69nvgRoDYKTB1Los',
      role: "cook",
      restaurant: "two",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
