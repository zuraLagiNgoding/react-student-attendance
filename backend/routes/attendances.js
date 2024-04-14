import express from "express";
import { addAttendance, getLastId, getToAttend } from "../controllers/attendance.js";

const router = express.Router();

// router.get("/", getAttendanceList);
router.get("/getToAttend/:id", getToAttend);
router.get("/lastId/:id", getLastId);
// router.get("/:id", getAttendanceList);
router.post("/", addAttendance);
// router.delete("/", deleteAttendanceList);
// router.put("/:id", updateAttendanceList);

export default router;
