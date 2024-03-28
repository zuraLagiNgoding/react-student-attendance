import { db } from "../db.js";
import bcrypt from "bcryptjs";

export const getTeachers = (req, res) => {
  const q =
    "SELECT * FROM teachers";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getTeacher = (req, res) => {
  const teacherId = req.params.id;
};

export const addTeacher = (req, res) => {
  const qTeacher =
    "INSERT INTO teachers(`nip`, `teacher_name`, `gender`, `address`, `phone_number`, `email`) VALUES (?)";
  const valuesTeacher = [
    req.body.nip,
    req.body.teacher_name,
    req.body.gender,
    req.body.address,
    req.body.phone_number,
    req.body.email,
  ];

  db.query(qTeacher, [valuesTeacher], (err, data) => {
    if (err) {
      return res.send(err);
    } else {
      const qUser =
        "INSERT INTO users(`username`, `role`, `email`, `password`) VALUES (?)";
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync("1", salt);

      const valuesUser = [
        req.body.nip,
        "TEACHER",
        req.body.email,
        hashedPassword,
      ];

      db.query(qUser, [valuesUser], (err) => {
        if (err) return res.send(err);
        return res.status(200).json(data);
      });
    }
  });
};

export const deleteTeacher = (req, res) => {
  const nip = req.query.delete;
  const q = "DELETE FROM teachers WHERE nip=?";

  db.query(q, [nip], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A teacher has been deleted.");
  });
};

export const updateTeacher = (req, res) => {};
