import express from "express";
import {
  addMajor,
  deleteMajor,
  getLastId,
  getMajor,
  getMajors,
  updateMajor,
} from "../controllers/major.js";

const router = express.Router();

router.get("/", getMajors);
router.get("/lastId", getLastId);
router.get("/:id", getMajor);
router.post("/", addMajor);
router.delete("/", deleteMajor);
router.put("/:id", updateMajor);

export default router;
