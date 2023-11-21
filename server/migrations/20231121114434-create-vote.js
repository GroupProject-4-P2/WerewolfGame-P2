'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Votes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      RoomId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Rooms",
          key: "id"
        }
      },
      TargetPlayerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Players",
          key: "id"
        }
      },
      SourcePlayerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Players",
          key: "id"
        }
      },
      session: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Votes');
  }
};