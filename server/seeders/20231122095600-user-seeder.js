'use strict';

const { hashPassword } = require('../helper/bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const date = new Date();
    await queryInterface.bulkInsert('Users', [
      {
        name: 'User 1',
        email: '1@mail.com',
        password: hashPassword('1'),
        createdAt: date,
        updatedAt: date,
      },
      {
        name: 'User 2',
        email: '2@mail.com',
        password: hashPassword('1'),
        createdAt: date,
        updatedAt: date,
      },
      {
        name: 'User 3',
        email: '3@mail.com',
        password: hashPassword('1'),
        createdAt: date,
        updatedAt: date,
      },
      {
        name: 'User 4',
        email: '4@mail.com',
        password: hashPassword('1'),
        createdAt: date,
        updatedAt: date,
      },
      {
        name: 'User 5',
        email: '5@mail.com',
        password: hashPassword('1'),
        createdAt: date,
        updatedAt: date,
      },
      {
        name: 'User 6',
        email: '6@mail.com',
        password: hashPassword('1'),
        createdAt: date,
        updatedAt: date,
      },
    ], {});


    await queryInterface.bulkInsert('Roles', [
      {
        name: 'Werewolf',
        createdAt: date,
        updatedAt: date,
      },
      {
        name: 'Villager',
        createdAt: date,
        updatedAt: date,
      }
    ])
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true
    });
    await queryInterface.bulkDelete('Roles', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true
    });
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
