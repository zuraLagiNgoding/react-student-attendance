import { db } from "../db.js";
import jwt from 'jsonwebtoken';

export const getAttendances = (req, res) => {
  const search = req.query.result
  const q = "SELECT * FROM attendance_list";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getToAttend = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not logged in yet!");

  jwt.verify(token, "halo", (err, data) => {
    if (err) return res.status(403).json("Token is not valid!");
    const scheduleId = req.params.id;

    const qClass =
      "SELECT schedules.schedule_id, schedules.class_id FROM schedules LEFT JOIN teachers ON teachers.nip = schedules.teacher_id WHERE schedules.schedule_id = ? AND teachers.uid = ?";

    db.query(qClass, [scheduleId, data.id], (err, classData) => {
      if (err) return res.send(err);
      const q = "SELECT students.nisn ,students.student_name FROM students WHERE students.class_id = ?";

      db.query(q, classData[0].class_id, (err, studentData) => {
        if (err) return res.send(err);
        return res.status(200).json(studentData)
      })
    });
  });
};

export const getLastId = (req, res) => {
  const q = "SELECT IFNULL(MAX(attendance_list_id) + 1, 1) AS next_id FROM attendance_list";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getAttendance = (req, res) => {
  const attendance_listId = req.params.id;
  const q = "SELECT * FROM attendance_list WHERE attendance_list_id=?";

  db.query(q, [attendance_listId], (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getUnique = (req, res) => {
  const { field, value } = req.params;
  const q = `SELECT COUNT(*) AS count FROM attendance_list WHERE ${field} = ?`;
  db.query(q, [value], (err, data) => {
    if (err) return res.send(err);

    const exists = data[0].count > 0
    res.json({ exists });
  })
}

export const addAttendanceList = (req, res) => {
  const q = "INSERT INTO attendance_list(`attendance_list_id`, `schedule_id`, `status`, `created_at`) VALUES (?, curdate())";

  const values = [req.body.id, req.body.schedule_id, req.body.status];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A new attendance list has been created.");
  });
};

export const deleteAttendance = (req, res) => {
  const attendance_listId = req.query.delete
  const q = "DELETE FROM attendance_list WHERE attendance_list_id=?";

  db.query(q, [attendance_listId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A attendance_list has been deleted.");
  });
};

export const updateAttendance = (req, res) => {};
