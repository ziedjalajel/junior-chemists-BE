const express = require("express");
const router = express.Router();

const {
  choiceFetch,
  choiceCreate,
  choiceList,
  choiceDetail,
} = require("../controllers/choiceController");

router.param("choiceId", async (req, res, next, choiceId) => {
  const choice = await choiceFetch(choiceId, next);
  if (choice) {
    req.choice = choice;
    next();
  } else {
    const err = new Error("Choice Not Found");
    err.status = 404;
    next(err);
  }
});

router.get("/", choiceList);

router.get("/:choiceId", choiceDetail);

router.post("/", choiceCreate);

module.exports = router;
