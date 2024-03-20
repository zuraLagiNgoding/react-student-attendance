import { db } from "../db.js"

export const getClasses = (req,res) => {
  const q = "SELECT * FROM classes";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getClass = (req, res) => {
  const classId = req.params.id;
  const q = "SELECT * FROM classes WHERE id=?";

  db.query(q, [classId], (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const addClass = (req, res) => {

};

export const deleteClass = (req, res) => {

};

export const updateClass = (req, res) => {

};