import { db } from "../db.js";

export const getMajors = (req, res) => {
  const q = "SELECT * FROM majors";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getLastId = (req, res) => {
  const q = "SELECT IFNULL(MAX(id) + 1, 1) AS next_id FROM majors";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getMajor = (req, res) => {
  const majorId = req.params.id;
  const q = "SELECT * FROM majors WHERE id=?";

  db.query(q, [majorId], (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const addMajor = (req, res) => {
  const q = "INSERT INTO majors(`id`, `name`) VALUES (?)";

  const values = [req.body.id, req.body.name];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A new major has been created.");
  });
};

export const deleteMajor = (req, res) => {
  const majorId = req.query.delete
  const q = "DELETE FROM majors WHERE id=?";

  db.query(q, [majorId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A major has been deleted.");
  });
};

export const updateMajor = (req, res) => {};
