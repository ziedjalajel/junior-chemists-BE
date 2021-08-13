module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define("Answer", {});

  Answer.associate = (models) => {
    models.Room.hasMany(Answer, {
      foreignKey: "roomId",
      as: "answers",
      alloNull: false,
    });

    Answer.belongsTo(models.Room, { foreignKey: "roomId" });
  };

  return Answer;
};
