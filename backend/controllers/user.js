
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

export const getTeacher = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not logged in yet!");

  jwt.verify(token, "halo", (err, data) => {
    if (err) return res.status(403).json("Token is not valid!")

    const q = "SELECT nip, teacher_name, email FROM teachers WHERE uid=?;";
  
    db.query(q, [data.id], (err, data) => {
      if (err) return res.send(err);
      return res.status(200).json(data);
    });
  })

};
