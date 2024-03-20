import classRoutes from "./routes/classes.js";
import express from "express";
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.use("/backend/classes", classRoutes);

app.listen(8800, () => {
  console.log("API Connected!");
});
