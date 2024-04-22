import jwt from 'jsonwebtoken';
import { db } from '../db.js';

export const sendAbsence = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not logged in yet!");

  jwt.verify(token, "halo", (err, data) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO messages(`subject`, `message`, `start_date`, `end_date`, `message_read`, `sender_id`, `receiver_id`, `send_at`) VALUES (?)";

    const values = [
      req.body.subject,
      req.body.message,
      req.body.start,
      req.body.end,
      `0`,
      data.id,
      req.body.receiver_id,
      new Date()
    ]

    db.query(q, [values], (err, data) => {
      if (err) return res.send(err);
      return res.status(200).json(data);
    });
  });
}

export const getUnreadMessages = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not logged in yet!");

  jwt.verify(token, "halo", (err, data) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "SELECT m.*, s.student_name FROM messages m LEFT JOIN students s ON s.uid = m.sender_id WHERE receiver_id = ? AND message_read = '0'";

    db.query(q, [data.id], (err, data) => {
      if (err) return res.send(err);
      return res.status(200).json(data);
    });
  });
};