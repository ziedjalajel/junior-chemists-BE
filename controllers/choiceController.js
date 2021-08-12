const { Choice } = require("../db/models");

exports.choiceFetch = async (choiceId, next) => {
  try {
    const choice = await Choice.findByPk(choiceId);
    return choice;
  } catch (error) {
    next(error);
  }
};

exports.choiceCreate = async (req, res, next) => {
  try {
    const newChoice = await Choice.create(req.body);
    res.status(201).json(newChoice);
  } catch (error) {
    next(error);
  }
};

exports.choiceList = async (req, res, next) => {
  try {
    const choices = await Choice.findAll({});
    res.json(choices);
  } catch (error) {
    next(error);
  }
};

exports.choiceDetail = async (req, res) => res.json(req.choice);
