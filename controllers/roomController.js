const { Room } = require("../db/models");

exports.roomFetch = async (roomId, next) => {
  try {
    const room = await Room.findByPk(roomId);
    return room;
  } catch (error) {
    next(error);
  }
};

exports.roomCreate = async (req, res, next) => {
  try {
    const newRoom = await Room.create(req.body);
    res.status(201).json(newRoom);
  } catch (error) {
    next(error);
  }
};

exports.roomList = async (req, res, next) => {
  try {
    const rooms = await Room.findAll({});
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

exports.roomDetail = async (req, res) => res.json(req.room);
