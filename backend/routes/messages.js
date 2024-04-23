import express from "express";
import { getAllMessages, getUnreadMessages, readMessage, sendAbsence } from "../controllers/message.js";
const router = express.Router();

router.post("/absence", sendAbsence);
router.get("/unread", getUnreadMessages);
router.put("/read/:id", readMessage);
router.get("/all", getAllMessages);

export default router;
