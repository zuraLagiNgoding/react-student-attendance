import { db } from "../db.js";
import jwt from 'jsonwebtoken';

export const getSchedules = (req, res) => {
  const search = req.query.result
  const q =
    "SELECT * FROM schedules LEFT JOIN subjects ON schedules.subject_id = subjects.subject_id LEFT JOIN teachers ON schedules.teacher_id = teachers.nip LEFT JOIN classes ON schedules.class_id = classes.class_id LEFT JOIN majors ON classes.major_id = majors.major_id";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getTeacherSchedules = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not logged in yet!");

  jwt.verify(token, "halo", (err, data) => {
    if (err) return res.status(403).json("Token is not valid!")
    
    const search = req.query.result;
    const q =
      "SELECT schedules.*, subjects.subject_name, teachers.teacher_name, CONCAT(classes.grade, ' ', majors.shorten, ' ', classes.identifier) as class_name FROM schedules LEFT JOIN subjects ON schedules.subject_id = subjects.subject_id LEFT JOIN teachers ON schedules.teacher_id = teachers.nip LEFT JOIN classes ON schedules.class_id = classes.class_id LEFT JOIN majors ON classes.major_id = majors.major_id WHERE teachers.uid = ?";
    
    db.query(q, [data.id], (err, data) => {
      if (err) return res.send(err);
      return res.status(200).json(data);
    });
  })

};

export const getLastId = (req, res) => {
  const q = "SELECT IFNULL(MAX(schedule_id) + 1, 1) AS next_id FROM schedules";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getSchedule = (req, res) => {
  const scheduleId = req.params.id;
  const q =
    "SELECT * FROM schedules LEFT JOIN subjects ON schedules.subject_id = subjects.subject_id LEFT JOIN teachers ON schedules.teacher_id = teachers.nip LEFT JOIN classes ON schedules.class_id = classes.class_id";

  db.query(q, [scheduleId], (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const addSchedule = (req, res) => {
  const q = "INSERT INTO schedules(`schedule_id`, `day`, `start`, `end`, `subject_id`, `teacher_id`, `class_id`) VALUES (?)";

  const values = [
    req.body.id,
    req.body.day,
    req.body.start,
    req.body.end,
    req.body.subject_id,
    req.body.teacher_id,
    req.body.class_id,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A new schedule has been created.");
  });
};

export const deleteSchedule = (req, res) => {
  const scheduleId = req.query.delete
  const q = "DELETE FROM schedules WHERE schedule_id=?";

  db.query(q, [scheduleId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A schedule has been deleted.");
  });
};

export const updateSchedule = (req, res) => {};
