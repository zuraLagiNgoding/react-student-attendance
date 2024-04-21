import express from "express";
import { getTeacher } from "../controllers/user.js";

const router = express.Router();

router.get("/teacher", getTeacher);

export default router;
