import express from "express";
import { addAttendanceList, getLastId, getToAttend } from "../controllers/attendance.js";

const router = express.Router();

// router.get("/", getAttendanceList);
router.get("/getToAttend/:id", getToAttend);
router.get("/lastId", getLastId);
// router.get("/:id", getAttendanceList);
router.post("/", addAttendanceList);
// router.delete("/", deleteAttendanceList);
// router.put("/:id", updateAttendanceList);

export default router;
