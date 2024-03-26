import { db } from "../db.js"

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
  const q =
    "INSERT INTO students(`nisn`, `student_name`, `gender`, `address`, `class_id`, `phoneNumber`, `email`) VALUES (?)"
  ;

  const values = [
    req.body.nisn,
    req.body.student_name,
    req.body.gender,
    req.body.address,
    req.body.class_id,
    req.body.phoneNumber,
    req.body.email,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  })
};

export const deleteStudent = (req, res) => {

};

export const updateStudent = (req, res) => {

};