"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Answers", "roomId", Sequelize.INTEGER, {
      allowNull: false,
      references: {
        model: {
          tableName: "Rooms",
        },
        key: "id",
      },
    });

    await queryInterface.addColumn("Answers", "questionId", Sequelize.INTEGER, {
      allowNull: false,
      references: {
        model: {
          tableName: "Questions",
        },
        key: "id",
      },
    });

    await queryInterface.addColumn("Answers", "choiceId", Sequelize.INTEGER, {
      allowNull: false,
      references: {
        model: {
          tableName: "Choices",
        },
        key: "id",
      },
    });

    await queryInterface.addColumn("Answers", "userId", Sequelize.INTEGER, {
      allowNull: false,
      references: {
        model: {
          tableName: "Users",
        },
        key: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Answers", "roomId");
    await queryInterface.removeColumn("Answers", "questionId");
    await queryInterface.removeColumn("Answers", "choiceId");
    await queryInterface.removeColumn("Answers", "userId");
  },
};
