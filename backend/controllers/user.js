
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

export const getUser = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not logged in yet!");

  jwt.verify(token, "halo", (err, data) => {
    if (err) return res.status(403).json("Token is not valid!")

    const q =
      "SELECT t.nip, t.teacher_name, t.email, NULL AS nisn, NULL AS student_name, NULL AS student_email FROM teachers t WHERE t.uid = ? UNION SELECT NULL AS nip, NULL AS teacher_name, NULL AS email, s.nisn, s.student_name, s.email FROM students s WHERE s.uid = ?;"
  
    db.query(q, [data.id, data.id], (err, data) => {
      if (err) return res.send(err);
      return res.status(200).json(data);
    });
  })

};
