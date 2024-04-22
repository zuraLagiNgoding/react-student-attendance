import { db } from "../db.js"
import jwt from 'jsonwebtoken';

export const getClasses = (req,res) => {
  const q =
    "SELECT *, teachers.teacher_name FROM classes LEFT JOIN majors ON majors.major_id = classes.major_id LEFT JOIN teachers ON classes.waliKelas = teachers.nip";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getClassByStudent = (req,res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not logged in yet!");

  jwt.verify(token, "halo", (err, data) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "SELECT c.*, m.shorten, m.major_name, t.uid, t.teacher_name FROM classes c INNER JOIN majors m ON c.major_id = m.major_id INNER JOIN teachers t ON c.waliKelas = t.nip INNER JOIN students s ON s.class_id = c.class_id WHERE s.uid = ?";

    db.query(q, [data.id], (err, data) => {
      if (err) return res.send(err);
      return res.status(200).json(data);
    });
  });
}

export const getLastId = (req, res) => {
  const q = "SELECT IFNULL(MAX(class_id) + 1, 1) AS next_id FROM classes";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getClass = (req, res) => {
  const classId = req.params.id;
  const q =
    "SELECT * FROM classes LEFT JOIN majors ON majors.major_id = classes.major_id WHERE class_id=?";

  db.query(q, [classId], (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const addClass = (req, res) => {
  const q =
    "INSERT INTO classes(`class_id`, `grade`, `identifier`, `waliKelas`, `major_id`) VALUES (?)";

  const values = [
    req.body.class_id,
    req.body.grade,
    req.body.identifier,
    req.body.waliKelas,
    req.body.major_id,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A new class has been created.");
  });
};

export const deleteClass = (req, res) => {
  const classId = req.query.delete;
  const q = "DELETE FROM classes WHERE class_id=?";

  db.query(q, [classId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A class has been deleted.");
  });
};

export const updateClass = (req, res) => {
  const classId = req.params.id;
  const q =
    "UPDATE classes SET grade = ?, major_id = ?, identifier = ?, waliKelas = ? WHERE class_id= ?";

  const values = [
    req.body.grade, 
    req.body.major_id, 
    req.body.identifier, 
    req.body.waliKelas, 
    classId
  ];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A class has been updated.");
  });
};