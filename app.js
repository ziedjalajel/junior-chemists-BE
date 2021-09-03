const express = require("express");
const http = require("http");

//socketio
const socketio = require("socket.io");

//Routes
const answerRoutes = require("./routes/answers");
const choiceRoutes = require("./routes/choices");
const questionRoutes = require("./routes/questions");
const roomRoutes = require("./routes/rooms");
const userRoutes = require("./routes/users");

//data
const { Room, User, User_room, Answer } = require("./db/models");

//cors
const cors = require("cors");

const app = express();

const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });

app.use(cors());

app.use(express.json());

// Routes
app.use("/answers", answerRoutes);
app.use("/choices", choiceRoutes);
app.use("/questions", questionRoutes);
app.use("/rooms", roomRoutes);
app.use("/users", userRoutes);

//for media
app.use("/media", express.static("media"));

io.on("connection", (socket) => {
  //this part is for the public room
  socket.on("joinRoom", async ({ username }) => {
    // req.body.name = (Math.random() + 1).toString(36).substring(2);
    // const newRoom = await Room.create(req.body);
    const newUser = await User.create({ username });

    const checkrooms = await Room.findAll({
      include: [
        {
          model: User,
          as: "users",
        },
      ],
    });
    const myRoom = checkrooms.find(
      (room) => room.users.length < 3 && room.name === null
    );

    //add to through table
    await User_room.create({ roomId: myRoom.id, userId: newUser.id });

    const updatedRoom = await Room.findOne({
      where: { id: myRoom.id },
      include: [
        {
          model: User,
          as: "users",
        },
      ],
    });

    socket.join(updatedRoom.id);
    socket.emit("numberOfUsers", updatedRoom.users.length);
    socket.emit("newUser", newUser);
    socket.emit(
      "usernames",
      updatedRoom.users.map((u) => u.username)
    );

    io.to(updatedRoom.id).emit("startRoom", {
      users: updatedRoom.users.map((u) => u.username),
      myRoom,
    });

    if (updatedRoom.users.length === 3) {
      await Room.create();
    }

    // the result part

    socket.on("myAnswers", (myAnswers) => {
      //this is for sending the users answers
      socket.on("resultEmit", () => {
        socket.emit("create-connection", myAnswers, newUser.id);
      });

      //this is for the score of the users
      socket.on("score", async (userScore, userId) => {
        const value = { score: userScore };
        const options = { multi: false };
        const addScore = await User.update(
          value,
          { where: { id: userId } },
          options
        );

        const bringScores = await Room.findOne({
          where: { id: updatedRoom.id },
          include: [
            {
              model: User,
              as: "users",
            },
          ],
        });

        io.to(bringScores.id).emit("usersScores", bringScores.users);
      });
    });
  });

  //this part is for the private room
  socket.on("joinPrivateRoom", async ({ team }) => {
    const newRoom = await Room.create({
      name: team.name,
      participant: team.participant,
    });
    socket.emit("slug", newRoom.slug);
  });

  socket.on("createUser", async ({ username, roomSlug }) => {
    const privateRoom = await Room.findOne({
      where: { slug: roomSlug },
      include: [
        {
          model: User,
          as: "users",
        },
      ],
    });

    const newUser = await User.create({ username });

    if (privateRoom.users.length + 1 <= privateRoom.participant) {
      await User_room.create({ roomId: privateRoom.id, userId: newUser.id });
    }

    socket.join(privateRoom.id);

    const updatedPrivateRoom = await Room.findOne({
      where: { slug: roomSlug },
      include: [
        {
          model: User,
          as: "users",
        },
      ],
    });

    // const number = 5;
    // socket.on("startGame", (n) => {
    //   io.to(updatedPrivateRoom.id).emit("letsStart", n);
    // });

    socket.emit("newUserPrivate", newUser);

    io.to(updatedPrivateRoom.id).emit("startPrivateRoom", {
      users: updatedPrivateRoom.users.map((u) => u.username),
      usersIds: updatedPrivateRoom.users.map((u) => u.id),
      privateRoom: updatedPrivateRoom,
    });

    //this is the answer part
    socket.on("myAnswersPrivate", (myAnswers) => {
      //this is for sending the users answers
      socket.on("privateResultEmit", () => {
        socket.emit("create-connection-private", myAnswers, newUser.id);
      });

      //this is for the score of the users
      socket.on("scorePrivate", async (userScore, userId) => {
        const value = { score: userScore };
        const options = { multi: false };
        const addScore = await User.update(
          value,
          { where: { id: userId } },
          options
        );

        const bringScores = await Room.findOne({
          where: { id: updatedPrivateRoom.id },
          include: [
            {
              model: User,
              as: "users",
            },
          ],
        });

        io.to(bringScores.id).emit("usersScoresPrivate", bringScores.users);
      });
    });
  });
});

// Middleware
app.use((req, res, next) => {
  const err = new Error("Path Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message || "Internal Server Error",
  });
});

const run = async () => {
  //   await db.sequelize.sync();
  await server.listen(8000, () => {
    console.log("The application is running on localhost:8000");
  });
};

run();
