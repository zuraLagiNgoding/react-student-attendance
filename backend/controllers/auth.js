import { db } from "../db.js";
import bcrypt from 'bcryptjs';

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ? AND email = ?";

  db.query(q, [req.body.username, req.body.email], (err, data) => {
    if (err) return res.send(err);
    if (data.length === 0) return res.status(404).json("User credentials not found!");

    const isPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!isPassword) return res.status(400).json("Wrong password!")
  });
};
