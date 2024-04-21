import { db } from "../db.js";

export const getClassrooms = (req, res) => {
  const search = req.query.result
  const q = "SELECT * FROM classrooms";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getClassroom = (req, res) => {
  const classroomId = req.params.id;
  const q = "SELECT * FROM classrooms WHERE classroom_id=?";

  db.query(q, [classroomId], (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const addClassroom = (req, res) => {
  const q = "INSERT INTO classrooms(`classroom_id`, `classroom_name`) VALUES (?)";

  const values = [req.body.id, req.body.name ];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A new classroom has been created.");
  });
};

export const deleteClassroom = (req, res) => {
  const classroomId = req.query.delete
  const q = "DELETE FROM classrooms WHERE classroom_id=?";

  db.query(q, [classroomId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A classroom has been deleted.");
  });
};

export const updateClassroom = (req, res) => {
  const classroomId = req.params.id;
  const q =
    "UPDATE classrooms SET classroom_name = ? WHERE classroom_id= ?";

  const values = [
    req.body.name,
    classroomId
  ];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A classroom has been updated.");
  });
};
