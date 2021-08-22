const {
  Room,
  Question_room,
  Question,
  User_room,
  User,
  Answer,
} = require("../db/models");

//fetch room
exports.roomFetch = async (roomId, next) => {
  try {
    const room = await Room.findByPk(roomId);
    return room;
  } catch (error) {
    next(error);
  }
};

//create room
exports.roomCreate = async (req, res, next) => {
  try {
    // req.body.name = (Math.random() + 1).toString(36).substring(2);
    const newRoom = await Room.create(req.body);
    res.status(201).json(newRoom);
  } catch (error) {
    next(error);
  }
};

// room list
exports.roomList = async (req, res, next) => {
  try {
    const rooms = await Room.findAll({
      include: [
        {
          model: Question,
          as: "questions",
        },
        {
          model: User,
          as: "users",
        },
        {
          model: Answer,
          as: "answers",
          attributes: ["id"],
        },
      ],
    });
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

//room detail
exports.roomDetail = async (req, res) => res.json(req.room);

//last room
exports.lastRoom = async (req, res, next) => {
  try {
    const rooms = await Room.findOne({
      where: { name: req.body.name },
      order: [["id", "DESC"]],
    });
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

// exports.lastRoom = async (req, res, next) => {
//   try {
//     const rooms = await Room.findOne({ order: [["id", "DESC"]] });
//     res.json(rooms);
//   } catch (error) {
//     next(error);
//   }
// };

//the method for the many-to-many relation between the question table and the room table(the Question_room through table)
exports.questionRoom = async (req, res, next) => {
  try {
    const question_room = req.body.map((connect) => ({
      ...connect,
      roomId: req.room.id,
    }));
    await Question_room.bulkCreate(question_room);
    const connect_question_room = {
      questions: req.body,
    };
    res.status(201).json(connect_question_room);
  } catch (error) {
    next(error);
  }
};

//the method for the many-to-many relation between the user table and the room table(the User_room through table)
exports.userRoom = async (req, res, next) => {
  try {
    const user_room = req.body.map((connect) => ({
      ...connect,
      roomId: req.room.id,
    }));
    await User_room.bulkCreate(user_room);
    const connect_user_room = {
      users: req.body,
    };
    res.status(201).json(connect_user_room);
  } catch (error) {
    next(error);
  }
};

//the method for the one-to-many relation between the room, question, choice, user table and the answer
exports.answerCreate = async (req, res, next) => {
  try {
    req.body.roomId = req.room.id;
    req.body.questionId = req.params.questionId;
    req.body.choiceId = req.params.choiceId;
    req.body.userId = req.params.userId;

    const newAnswer = await Answer.create(req.body);
    res.status(201).json(newAnswer);
  } catch (error) {
    next(error);
  }
};
