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
const { Room, User, User_room } = require("./db/models");

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
    const myRoom = checkrooms.find((room) => room.users.length < 3);

    socket.emit("roomLength", myRoom.users.length);

    console.log(myRoom.id);
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

    console.log(updatedRoom.users.map((u) => u.username));

    // const addUsersToRomm =
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
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
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
