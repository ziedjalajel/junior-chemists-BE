const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");

const {
  questionFetch,
  questionCreate,
  questionList,
  questionDetail,
} = require("../controllers/questionController");

router.param("questionId", async (req, res, next, questionId) => {
  const question = await questionFetch(questionId, next);
  if (question) {
    req.question = question;
    next();
  } else {
    const err = new Error("Question Not Found");
    err.status = 404;
    next(err);
  }
});

router.get("/", questionList);

router.get("/:questionId", questionDetail);

router.post("/", upload.single("image"), questionCreate);

module.exports = router;
