import classRoutes from "./routes/classes.js";
import classRoomRoutes from "./routes/classrooms.js";
import studentRoutes from "./routes/students.js";
import teacherRoutes from "./routes/teachers.js";
import subjectRoutes from "./routes/subjects.js";
import scheduleRoutes from "./routes/schedules.js";
import attendanceRoutes from "./routes/attendances.js";
import majorRoutes from "./routes/majors.js";
import authRoutes from "./routes/auths.js";
import userRoutes from "./routes/users.js";
import messageRoutes from "./routes/messages.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173"
  }
});

const app = express();
//middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(cookieParser());

//routes
app.use("/backend/auth", authRoutes);
app.use("/backend/messages", messageRoutes);
app.use("/backend/users", userRoutes);
app.use("/backend/classes", classRoutes);
app.use("/backend/classrooms", classRoomRoutes);
app.use("/backend/students", studentRoutes);
app.use("/backend/students", studentRoutes);
app.use("/backend/teachers", teacherRoutes);
app.use("/backend/majors", majorRoutes);
app.use("/backend/subjects", subjectRoutes);
app.use("/backend/schedules", scheduleRoutes);
app.use("/backend/attendances", attendanceRoutes);

app.listen(8800, () => {
  console.log("API Connected!");
});

//websocket

let activeUser = []

const addUser = (userId, socketId) => {
  !activeUser.some((user) => user.userId === userId) &&
    activeUser.push({ userId, socketId });
}

const removeUser = (socketId) => {
  activeUser = activeUser.filter((user) => user.socketId !== socketId);
}

const getUser = (userId) => {
  return activeUser.find((user => user.userId === userId));
}

io.on("connection", (socket) => {
  console.log("user has connected")
  console.log(activeUser)
  //get active user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
  })

  //send activities notifications
  socket.on("sendNotification", ({ receiverId }) => {
    //getting receiver id and ping the the receiver to refetch
    const receiver = getUser(receiverId);
    io.to(receiver.socketId).emit("getNewNotification", {
      ping: true
    })
  })

  socket.on("disconnect", () => {
    removeUser(socket.id);
  })
})

io.listen(5000);