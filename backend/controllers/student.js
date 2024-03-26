import { db } from "../db.js"

export const getStudents = (req,res) => {
  const q = "SELECT * FROM students LEFT JOIN classes ON classes.classId = students.classId;";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getStudent = (req, res) => {
  const classId = req.params.id;
  
};

export const addStudent = (req, res) => {

};

export const deleteStudent = (req, res) => {

};

export const updateStudent = (req, res) => {

};