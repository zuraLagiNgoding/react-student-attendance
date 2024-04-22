import express from "express";
import {
  addSchedule,
  deleteSchedule,
  getFilledTeacherSchedules,
  getLastId,
  getSchedule,
  getSchedules,
  getStudentSchedules,
  getTeacherSchedules,
  updateSchedule,
} from "../controllers/schedule.js";

const router = express.Router();

router.get("/", getSchedules);
router.get("/teacher", getTeacherSchedules);
router.get("/student", getStudentSchedules);
router.get("/teacher/filled", getFilledTeacherSchedules);
router.get("/lastId", getLastId);
router.get("/:id", getSchedule);
router.post("/", addSchedule);
router.delete("/", deleteSchedule);
router.put("/:id", updateSchedule);

export default router;
