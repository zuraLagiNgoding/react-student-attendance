import express from "express";
import {
  addClassroom,
  deleteClassroom,
  getClassroom,
  getClassrooms,
  updateClassroom,
} from "../controllers/classroom.js";

const router = express.Router();

router.get("/", getClassrooms);
router.get("/:id", getClassroom);
router.post("/", addClassroom);
router.delete("/", deleteClassroom);
router.put("/:id", updateClassroom);

export default router;
