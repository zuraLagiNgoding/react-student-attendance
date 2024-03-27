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
  
};

export const addStudent = (req, res) => {
  const qStudent =
    "INSERT INTO students(`nisn`, `student_name`, `gender`, `address`, `class_id`, `phoneNumber`, `email`) VALUES (?)"
  ;

  const valuesStudent = [
    req.body.nisn,
    req.body.student_name,
    req.body.gender,
    req.body.address,
    req.body.class_id,
    req.body.phoneNumber,
    req.body.email,
  ];

  db.query(qStudent, [valuesStudent], (err, data) => {
    if (err) {
      return res.send(err)
    }
    else { 
      const qUser =
        "INSERT INTO users(`username`, `role`, `email`, `password`) VALUES (?)"
      ;
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync("1", salt)

      const valuesUser = [
        req.body.nisn,
        "STUDENT",
        req.body.email,
        hashedPassword
      ];
      
      db.query(qUser, [valuesUser], (err) => {
        if (err) return res.send(err);
        return res.status(200).json(data);
      })
    };
  })
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

};