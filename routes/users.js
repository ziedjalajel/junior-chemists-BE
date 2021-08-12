const express = require("express");
const router = express.Router();

const {
  userFetch,
  userCreate,
  userList,
  userDetail,
} = require("../controllers/userController");

router.param("userId", async (req, res, next, userId) => {
  const user = await userFetch(userId, next);
  if (user) {
    /**
     * @Octowl:
     *
     * Isn't passport already assigning `req.user` for the currently authenticated user.
     * Consider giving this a different name. `req._user`? `req.foundUser`?
     *
     * This way you know "Who's asking for the user?" and "Which user are they asking for?"
     */
    req.user = user;
    next();
  } else {
    const err = new Error("User Not Found");
    err.status = 404;
    next(err);
  }
});

router.get("/", userList);

router.get("/:userId", userDetail);

router.post("/", userCreate);

module.exports = router;
