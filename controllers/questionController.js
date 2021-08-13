const { Question, Choice, Answer } = require("../db/models");

exports.questionFetch = async (questionId, next) => {
  try {
    const question = await Question.findByPk(questionId);
    return question;
  } catch (error) {
    next(error);
  }
};

exports.questionCreate = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    }
    const newQuestion = await Question.create(req.body);
    res.status(201).json(newQuestion);
  } catch (error) {
    next(error);
  }
};

//this is for the one to many relation between the question and choice
exports.choiceCreate = async (req, res, next) => {
  try {
    req.body.questionId = req.question.id;
    const newChoice = await Choice.create(req.body);
    res.status(201).json(newChoice);
  } catch (error) {
    next(error);
  }
};

exports.questionList = async (req, res, next) => {
  try {
    const questions = await Question.findAll({
      include: [
        {
          model: Choice,
          as: "choices",
          attributes: ["id"],
        },
        {
          model: Answer,
          as: "answers",
          attributes: ["id"],
        },
      ],
    });
    res.json(questions);
  } catch (error) {
    next(error);
  }
};

exports.questionDetail = async (req, res) => res.json(req.question);
