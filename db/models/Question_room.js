module.exports = (sequelize) => {
  const Question_room = sequelize.define("Question_room", {});

  Question_room.associate = (models) => {
    models.Question.belongsToMany(models.Room, {
      through: Question_room,
      foreignKey: "questionId",
      as: "rooms",
    });
    models.Room.belongsToMany(models.Question, {
      through: Question_room,
      foreignKey: "roomId",
      as: "questions",
    });
  };

  return Question_room;
};
