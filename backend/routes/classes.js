import express from "express";
import {
  addClass,
  deleteClass,
  getClass,
  getClassByStudent,
  getClasses,
  getLastId,
  updateClass,
} from "../controllers/class.js";

const router = express.Router();

router.get("/", getClasses);
router.get("/student", getClassByStudent);
router.get("/lastId", getLastId);
router.get("/:id", getClass);
router.post("/", addClass);
router.delete("/", deleteClass);
router.put("/:id", updateClass);

export default router;
