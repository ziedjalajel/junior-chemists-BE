const express = require("express");
const http = require("http");
// Database
const db = require("./db/models");
//socketio
const socketio = require("socket.io");

//Routes
const answerRoutes = require("./routes/answers");
const choiceRoutes = require("./routes/choices");
const questionRoutes = require("./routes/questions");
const roomRoutes = require("./routes/rooms");
const userRoutes = require("./routes/users");

//data
const { Room } = require("./db/models");

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
  socket.on("joinRoom", async ({ username, room }) => {
    socket.join(room);
    console.log(username, room);

    //io.to(room).emit("startRoom",questions)
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
