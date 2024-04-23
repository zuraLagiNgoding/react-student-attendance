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
      "SELECT m.*, s.student_name, t.teacher_name FROM messages m LEFT JOIN students s ON s.uid = m.sender_id LEFT JOIN teachers t ON t.uid = m.sender_id WHERE receiver_id = ? AND message_read = '0' ORDER BY m.send_at DESC";

    db.query(q, [data.id], (err, data) => {
      if (err) return res.send(err);
      return res.status(200).json(data);
    });
  });
};

export const getAllMessages = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not logged in yet!");

  jwt.verify(token, "halo", (err, data) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "SELECT m.*, s.student_name, CONCAT(c.grade, ' ', mj.shorten, ' ', c.identifier) as class_name,t.teacher_name FROM messages m LEFT JOIN students s ON s.uid = m.sender_id LEFT JOIN classes c ON s.class_id = c.class_id LEFT JOIN majors mj ON c.major_id = mj.major_id LEFT JOIN teachers t ON t.uid = m.sender_id WHERE receiver_id = ? ORDER BY m.send_at DESC";

    db.query(q, [data.id], (err, data) => {
      if (err) return res.send(err);
      return res.status(200).json(data);
    });
  });
};

export const readMessage = (req,res) => {
  const messageId = req.params.id
  const q =
    "UPDATE messages SET message_read = ? WHERE message_id = ?";

  const values = ["1", messageId];

  db.query(q, values, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
}