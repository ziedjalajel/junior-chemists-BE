module.exports = (sequelize, DataTypes) => {
  const Choice = sequelize.define("Choice", {
    text: {
      type: DataTypes.STRING,
    },
    isTrue: {
      type: DataTypes.BOOLEAN,
    },
  });
  return Choice;
};
