import { db } from "../db.js"

export const getClasses = (req,res) => {
  const q =
    "SELECT * FROM classes LEFT JOIN majors ON majors.major_id = classes.major_id";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

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

};