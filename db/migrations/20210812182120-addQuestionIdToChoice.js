"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Choices", "questionId", Sequelize.INTEGER, {
      allowNull: false,
      references: {
        model: {
          tableName: "Questions",
        },
        key: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Choices", "questionId");
  },
};
