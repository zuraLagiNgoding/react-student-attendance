import express from "express";
import { addTeacher, deleteTeacher, getTeacher, getTeachers, updateTeacher } from "../controllers/teachers.js";

const router = express.Router();

router.get("/", getTeachers);
router.get("/:id", getTeacher);
router.post("/", addTeacher);
router.delete("/", deleteTeacher);
router.put("/:id", updateTeacher);

export default router;