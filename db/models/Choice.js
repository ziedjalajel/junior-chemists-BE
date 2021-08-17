module.exports = (sequelize, DataTypes) => {
  const Choice = sequelize.define("Choice", {
    text: {
      type: DataTypes.STRING,
    },
    isTrue: {
      type: DataTypes.BOOLEAN,
    },
    point: {
      type: DataTypes.INTEGER,
    },
  });

  Choice.associate = (models) => {
    models.Question.hasMany(Choice, {
      foreignKey: "questionId",
      as: "choices",
      allowNull: false,
    });

    Choice.belongsTo(models.Question, { foreignKey: "questionId" });
  };

  return Choice;
};
