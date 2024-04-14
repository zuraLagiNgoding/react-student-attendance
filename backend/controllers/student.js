import { db } from "../db.js";
import bcrypt from "bcryptjs";

export const getStudents = (req,res) => {
  const q =
    "SELECT * FROM students LEFT JOIN classes ON classes.class_id = students.class_id LEFT JOIN majors ON classes.major_id = majors.major_id;";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getStudent = (req, res) => {
  const classId = req.params.id;
  const q =
    "SELECT * FROM students LEFT JOIN classes ON classes.class_id = students.class_id LEFT JOIN majors ON classes.major_id = majors.major_id WHERE nisn=?;";
  
  db.query(q, [classId], (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};


export const addStudent = (req, res) => {
  const qUser =
    "INSERT INTO users(`username`, `role`, `email`, `password`) VALUES (?)";
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync("1", salt);

  const valuesUser = [req.body.nisn, "STUDENT", req.body.email, hashedPassword];

  db.query(qUser, [valuesUser], (err) => {
    if (err) return res.send(err);
    
    const qGetLastId = "SELECT IFNULL(MAX(id), 1) AS next_id FROM users";

    db.query(qGetLastId, (err, data) => {
      if (err) {
        return res.send(err);
      } else {
        const next_id = data[0].next_id;

        const qStudent =
          "INSERT INTO students(`nisn`, `student_name`, `gender`, `address`, `class_id`, `phoneNumber`, `email`, `uid`) VALUES (?)";
        const valuesStudent = [
          req.body.nisn,
          req.body.student_name,
          req.body.gender,
          req.body.address,
          req.body.class_id,
          req.body.phoneNumber,
          req.body.email,
          next_id,
        ];

        db.query(qStudent, [valuesStudent], (err, data) => {
          if (err) return res.send(err);
          return res.status(200).json(data);
        });
      }
    });
  });
};

export const deleteStudent = (req, res) => {
  const nisn = req.query.delete;
  const q = "DELETE FROM students WHERE nisn=?";

  db.query(q, [nisn], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A student has been deleted.");
  });
};

export const updateStudent = (req, res) => {
  const studentId = req.params.id;
  const q = "UPDATE students SET class_id = ?, student_name = ?, address = ?, gender = ?, phoneNumber = ?, email = ? WHERE nisn= ?";

  const values = [
    req.body.class_id,
    req.body.name,
    req.body.address,
    req.body.gender,
    req.body.phoneNumber,
    req.body.email,
    studentId,
  ];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A student has been updated.");
  });
};