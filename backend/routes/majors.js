import express from "express";
import {
  addMajor,
  deleteMajor,
  getLastId,
  getMajor,
  getMajors,
  getUnique,
  updateMajor,
} from "../controllers/major.js";

const router = express.Router();

router.get("/", getMajors);
router.get("/lastId", getLastId);
router.get("/:field/:value", getUnique);
router.get("/:id", getMajor);
router.post("/", addMajor);
router.delete("/", deleteMajor);
router.put("/:id", updateMajor);

export default router;
