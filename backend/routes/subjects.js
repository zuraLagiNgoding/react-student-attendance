import express from "express";
import {
  addSubject,
  deleteSubject,
  getLastId,
  getSubject,
  getSubjects,
  updateSubject,
} from "../controllers/subject.js";

const router = express.Router();

router.get("/", getSubjects);
router.get("/lastId", getLastId);
router.get("/:id", getSubject);
router.post("/", addSubject);
router.delete("/", deleteSubject);
router.put("/:id", updateSubject);

export default router;
