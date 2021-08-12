const express = require("express");
const router = express.Router();

const {
  answerFetch,
  answerCreate,
  answerList,
  answerDetail,
} = require("../controllers/answerController");

router.param("answerId", async (req, res, next, answerId) => {
  const answer = await answerFetch(answerId, next);
  if (answer) {
    req.answer = answer;
    next();
  } else {
    const err = new Error("Answer Not Found");
    err.status = 404;
    next(err);
  }
});

router.get("/", answerList);

router.get("/:answerId", answerDetail);

router.post("/", answerCreate);

module.exports = router;
