import { db } from "../db.js";

export const getSubjects = (req, res) => {
  const search = req.query.result
  const q = "SELECT * FROM subjects";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getLastId = (req, res) => {
  const q = "SELECT IFNULL(MAX(subject_id) + 1, 1) AS next_id FROM subjects";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getSubject = (req, res) => {
  const subjectId = req.params.id;
  const q = "SELECT * FROM subjects WHERE subject_id=?";

  db.query(q, [subjectId], (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const addSubject = (req, res) => {
  const q = "INSERT INTO subjects(`subject_id`, `subject_name`, `subject_code`) VALUES (?)";

  const values = [req.body.id, req.body.name, req.body.code];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A new subject has been created.");
  });
};

export const deleteSubject = (req, res) => {
  const subjectId = req.query.delete
  const q = "DELETE FROM subjects WHERE subject_id=?";

  db.query(q, [subjectId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A subject has been deleted.");
  });
};

export const updateSubject = (req, res) => {
  const subjectId = req.params.id;
  const q =
    "UPDATE subjects SET subject_name = ?, subject_code = ? WHERE subject_id= ?";

  const values = [
    req.body.name,
    req.body.code,
    subjectId,
  ];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A subject has been updated.");
  });
};
