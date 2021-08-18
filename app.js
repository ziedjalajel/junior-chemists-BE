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
    const myRoom = checkrooms.find((room) => room.users.length < 5);
    const users = [];
    users.push(newUser.id);

    console.log(users);

    console.log(myRoom.id);
    //add to through table
    await User_room.create({ roomId: myRoom.id, userId: newUser.id });

    socket.emit("roomLength", myRoom.users.length);

    // const addUsersToRomm =
    socket.join(myRoom.id);
    socket.emit("newUser", newUser);
    if (myRoom.users.length === 4) {
      io.to(myRoom.id).emit("startRoom", {
        users: myRoom.users.map((u) => u.username),

        myRoom,
      });
    }
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

// app.post("/room", async (req, res, next) => {
//   try {
//     req.body.name = `wej5ol3mh${Math.floor(
//       Math.random() * 100
//     )}werplbnqae${Math.floor(Math.random() * 1000)}vge`;
//     const newRoom = await Room.create(req.body);
//     res.status(201).json(newRoom);
//   } catch (error) {
//     next(error);
//   }
// });

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
