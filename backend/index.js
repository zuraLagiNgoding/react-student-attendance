import classRoutes from "./routes/classes.js";
import studentRoutes from "./routes/students.js";
import teacherRoutes from "./routes/teachers.js";
import majorRoutes from "./routes/majors.js";
import authRoutes from "./routes/auths.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
//middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//routes
app.use("/backend/auth", authRoutes);
app.use("/backend/classes", classRoutes);
app.use("/backend/students", studentRoutes);
app.use("/backend/students", studentRoutes);
app.use("/backend/teachers", teacherRoutes);
app.use("/backend/majors", majorRoutes);

app.listen(8800, () => {
  console.log("API Connected!");
});
