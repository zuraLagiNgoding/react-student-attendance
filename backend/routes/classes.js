import express from "express";
import { addClass, deleteClass, getClass, getClasses, updateClass } from "../controllers/class.js";

const router = express.Router();

router.get("/", getClasses);
router.get("/:id", getClass);
router.post("/", addClass);
router.delete("/:id", deleteClass);
router.put("/:id", updateClass);

export default router;