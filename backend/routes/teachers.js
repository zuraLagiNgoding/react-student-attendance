import express from "express";
import { addTeacher, deleteTeacher, getAllTeachers, getStaff, getTeacher, getTeachers, updateTeacher } from "../controllers/teacher.js";

const router = express.Router();

router.get("/all", getAllTeachers);
router.get("/staff", getStaff);
router.get("/", getTeachers);
router.get("/:id", getTeacher);
router.post("/", addTeacher);
router.delete("/", deleteTeacher);
router.put("/:id", updateTeacher);

export default router;