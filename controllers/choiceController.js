const { Choice, Answer } = require("../db/models");

exports.choiceFetch = async (choiceId, next) => {
  try {
    const choice = await Choice.findByPk(choiceId);
    return choice;
  } catch (error) {
    next(error);
  }
};

exports.choiceList = async (req, res, next) => {
  try {
    const choices = await Choice.findAll({
      include: {
        model: Answer,
        as: "answers",
        attributes: ["id"],
      },
    });
    res.json(choices);
  } catch (error) {
    next(error);
  }
};

exports.choiceDetail = async (req, res) => res.json(req.choice);
