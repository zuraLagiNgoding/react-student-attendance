import classRoutes from "./routes/classes.js";
import studentRoutes from "./routes/students.js";
import express from "express";
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.use("/backend/classes", classRoutes);
app.use("/backend/students", studentRoutes);

app.listen(8800, () => {
  console.log("API Connected!");
});
