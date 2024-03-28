import { db } from "../db.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ? AND email = ?";

  db.query(q, [req.body.username, req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User credentials not found!");

    const isPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!isPassword) return res.status(400).json("Wrong password!")

    const token = jwt.sign({ id: data[0].id }, "halo");
    const { password, ...other } = data[0];

    res.cookie("access_token", token, {
      httpOnly: true
    });
    res.status(200).json(other);
  });
};

export const logout = (req, res) => {
  res.clearCookie("access_token", {
    sameSite: "none",
    secure: true
  }).status(200).json("User has been logged out.")
}
