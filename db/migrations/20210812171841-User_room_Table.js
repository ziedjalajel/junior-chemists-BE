"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("User_rooms", {
      userId: {
        type: Sequelize.INTEGER,
        reference: {
          model: {
            tableName: "Users",
            schema: "schema",
          },
          key: "id",
        },
        allowNull: false,
      },

      roomId: {
        type: Sequelize.INTEGER,
        reference: {
          model: {
            tableName: "Rooms",
            schema: "schema",
          },
          key: "id",
        },
        allowNull: false,
      },

      updatedAt: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("User_rooms");
  },
};
