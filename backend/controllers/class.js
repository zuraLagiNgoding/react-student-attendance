import { db } from "../db.js"

export const getClasses = (req,res) => {
  const q =
    "SELECT * FROM classes LEFT JOIN majors ON majors.majorId = classes.majorId";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getLastId = (req, res) => {
  const q = "SELECT IFNULL(MAX(id) + 1, 1) AS next_id FROM classes";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getClass = (req, res) => {
  const classId = req.params.id;
  const q = "SELECT * FROM classes LEFT JOIN ON majors.id = classes.majorId WHERE id=?";

  db.query(q, [classId], (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const addClass = (req, res) => {
  const q =
    "INSERT INTO classes(`id`, `grade`, `class`, `waliKelas`, `majorId`) VALUES (?)";

  const values = [
    req.body.id,
    req.body.grade,
    req.body.class,
    req.body.waliKelas,
    req.body.majorId,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A new class has been created.");
  });
};

export const deleteClass = (req, res) => {

};

export const updateClass = (req, res) => {

};