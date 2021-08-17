"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Question_rooms", {
      questionId: {
        type: Sequelize.INTEGER,
        reference: {
          model: {
            tableName: "Questions",
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
    await queryInterface.dropTable("Question_rooms");
  },
};
