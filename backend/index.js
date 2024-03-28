import classRoutes from "./routes/classes.js";
import studentRoutes from "./routes/students.js";
import majorRoutes from "./routes/majors.js";
import authRoutes from "./routes/auths.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/backend/auth", authRoutes);
app.use("/backend/classes", classRoutes);
app.use("/backend/students", studentRoutes);
app.use("/backend/majors", majorRoutes);

app.listen(8800, () => {
  console.log("API Connected!");
});
