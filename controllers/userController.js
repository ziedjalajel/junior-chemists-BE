const { User, Answer } = require("../db/models");

exports.userFetch = async (userId, next) => {
  try {
    const user = await User.findByPk(userId);
    return user;
  } catch (error) {
    next(error);
  }
};

exports.userCreate = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

exports.userList = async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: {
        model: Answer,
        as: "answers",
        attributes: ["id"],
      },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.userDetail = async (req, res) => res.json(req.user);

// exports.userUpdate = async (req, res, next) => {
//   try {
//     const value = { score: 30 };
//     const updateUser = await req.user.update(value);
//     res.status(201).json(updateUser);
//   } catch (error) {
//     next(error);
//   }
// };

exports.userUpdate = async (req, res, next) => {
  try {
    const value = { score: 50 };
    const options = { multi: false };
    const updateUser = await User.update(
      value,
      { where: { id: req.params.userId } },
      options
    );
    res.status(201).json(updateUser);
  } catch (error) {
    next(error);
  }
};
