import express from "express";
import { addAttendance, getAttendanceList, getLastId, getRecap, getRecaps, getSubjects, getToAttend, updateAttendanceList } from "../controllers/attendance.js";

const router = express.Router();

router.get("/list/:id", getAttendanceList);
router.get("/getToAttend/:id", getToAttend);
router.get("/lastId/:id", getLastId);
router.get("/recaps", getRecaps);
router.get("/recap/:id", getRecap);
router.get("/recap/subjects/:id", getSubjects);
// router.get("/:id", getAttendanceList);
router.post("/", addAttendance);
// router.delete("/", deleteAttendanceList);
router.put("/", updateAttendanceList);

export default router;
