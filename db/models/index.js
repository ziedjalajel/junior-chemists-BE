"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//one to many relation between question and answer
db.Question.hasMany(db.Answer, {
  foreignKey: "questionId",
  as: "answers",
  allowNull: false,
});

db.Answer.belongsTo(db.Question, { foreignKey: "questionId" });

//one to many relation between choice and answer
db.Choice.hasMany(db.Answer, {
  foreignKey: "choiceId",
  as: "answers",
  allowNull: false,
});

db.Answer.belongsTo(db.Choice, { foreignKey: "choiceId" });

//one to many relation between user and answer
db.User.hasMany(db.Answer, {
  foreignKey: "userId",
  as: "answers",
  allowNull: false,
});

db.Answer.belongsTo(db.User, { foreignKey: "userId" });

module.exports = db;
