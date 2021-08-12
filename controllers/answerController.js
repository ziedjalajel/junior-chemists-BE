const { Answer } = require("../db/models");

exports.answerFetch = async (answerId, next) => {
  try {
    const answer = await Answer.findByPk(answerId);
    return answer;
  } catch (error) {
    next(error);
  }
};

exports.answerCreate = async (req, res, next) => {
  try {
    const newAnswer = await Answer.create(req.body);
    res.status(201).json(newAnswer);
  } catch (error) {
    next(error);
  }
};

exports.answerList = async (req, res, next) => {
  try {
    const answers = await Answer.findAll({});
    res.json(answers);
  } catch (error) {
    next(error);
  }
};

exports.answerDetail = async (req, res) => res.json(req.answer);
