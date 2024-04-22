import express from "express";
import { getUnreadMessages, sendAbsence } from "../controllers/message.js";
const router = express.Router();

router.post("/absence", sendAbsence);
router.get("/unread", getUnreadMessages);

export default router;
