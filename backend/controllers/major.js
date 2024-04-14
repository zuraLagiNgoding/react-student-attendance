import { db } from "../db.js";

export const getMajors = (req, res) => {
  const search = req.query.result
  const q = "SELECT * FROM majors";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getLastId = (req, res) => {
  const q = "SELECT IFNULL(MAX(major_id) + 1, 1) AS next_id FROM majors";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getMajor = (req, res) => {
  const majorId = req.params.id;
  const q = "SELECT * FROM majors WHERE major_id=?";

  db.query(q, [majorId], (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getUnique = (req, res) => {
  const { field, value } = req.params;
  const q = `SELECT COUNT(*) AS count FROM majors WHERE ${field} = ?`;
  db.query(q, [value], (err, data) => {
    if (err) return res.send(err);

    const exists = data[0].count > 0
    res.json({ exists });
  })
}

export const addMajor = (req, res) => {
  const q = "INSERT INTO majors(`major_id`, `major_name`, `shorten`) VALUES (?)";

  const values = [req.body.id, req.body.name, req.body.shorten];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A new major has been created.");
  });
};

export const deleteMajor = (req, res) => {
  const majorId = req.query.delete
  const q = "DELETE FROM majors WHERE major_id=?";

  db.query(q, [majorId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A major has been deleted.");
  });
};

export const updateMajor = (req, res) => {
  const majorId = req.params.id;
  const q =
    "UPDATE majors SET major_name = ?, shorten = ? WHERE major_id= ?";

  const values = [
    req.body.name, 
    req.body.shorten,
    majorId
  ];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A new major has been created.");
  });
};
