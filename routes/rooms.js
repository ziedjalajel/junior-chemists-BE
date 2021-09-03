const express = require("express");
const router = express.Router();

const {
  roomFetch,
  roomCreate,
  roomList,
  roomDetail,
  questionRoom,
  userRoom,
  answerCreate,
  lastRoom,
} = require("../controllers/roomController");

router.param("roomId", async (req, res, next, roomId) => {
  const room = await roomFetch(roomId, next);
  if (room) {
    req.room = room;
    next();
  } else {
    const err = new Error("Room Not Found");
    err.status = 404;
    next(err);
  }
});

router.get("/", roomList);

router.get("/the", lastRoom);

router.get("/:roomId", roomDetail);

router.post("/", roomCreate);

router.post("/:roomId/questionroom", questionRoom);

router.post("/:roomId/userroom", userRoom);

router.post("/:roomId/:questionId/:choiceId/:userId", answerCreate);

module.exports = router;
