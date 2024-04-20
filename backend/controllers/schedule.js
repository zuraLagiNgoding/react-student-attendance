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
      "SELECT s.*, sub.subject_name, t.teacher_name, CONCAT(c.grade, ' ', m.shorten, ' ', c.identifier) as class_name FROM schedules s LEFT JOIN (SELECT DISTINCT schedule_id FROM attendance_list) AS al ON s.schedule_id = al.schedule_id LEFT JOIN subjects sub ON s.subject_id = sub.subject_id LEFT JOIN teachers t ON s.teacher_id = t.nip LEFT JOIN classes c ON s.class_id = c.class_id LEFT JOIN majors m ON c.major_id = m.major_id WHERE t.uid = ?";
    
    db.query(q, [data.id], (err, data) => {
      if (err) return res.send(err);
      return res.status(200).json(data);
    });
  })

};

export const getFilledTeacherSchedules = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not logged in yet!");

  jwt.verify(token, "halo", (err, data) => {
    if (err) return res.status(403).json("Token is not valid!")
    
    const search = req.query.result;
    const q =
      "SELECT attendance_list.created_at, attendance_list.status, schedules.*, subjects.subject_name, teachers.teacher_name, CONCAT(classes.grade, ' ', majors.shorten, ' ', classes.identifier) as class_name FROM schedules LEFT JOIN attendance_list ON attendance_list.schedule_id = schedules.schedule_id LEFT JOIN subjects ON schedules.subject_id = subjects.subject_id LEFT JOIN teachers ON schedules.teacher_id = teachers.nip LEFT JOIN classes ON schedules.class_id = classes.class_id LEFT JOIN majors ON classes.major_id = majors.major_id WHERE teachers.uid = ?";
    
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
    "SELECT * FROM schedules LEFT JOIN subjects ON schedules.subject_id = subjects.subject_id LEFT JOIN teachers ON schedules.teacher_id = teachers.nip LEFT JOIN classes ON schedules.class_id = classes.class_id LEFT JOIN majors ON classes.major_id = majors.major_id WHERE schedule_id = ?";

  db.query(q, [scheduleId], (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const addSchedule = (req, res) => {
  const check =
    "SELECT * FROM schedules WHERE ((? >= start AND ? < end) OR (? > start AND ? < end)) AND class_id = ? AND day = ?";

  const checkValues = [
    req.body.start,
    req.body.start,
    req.body.end,
    req.body.end,
    req.body.class_id,
    req.body.day
  ]

  db.query(check, checkValues, (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length > 0) return res
      .status(403)
      .json(
        "The schedule for that time and day already exists. Please choose a different time or day."
      );
    
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
  })
};

export const deleteSchedule = (req, res) => {
  const scheduleId = req.query.delete
  const q = "DELETE FROM schedules WHERE schedule_id=?";

  db.query(q, [scheduleId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("A schedule has been deleted.");
  });
};

export const updateSchedule = (req, res) => {
  const check =
    "SELECT * FROM schedules WHERE ((? >= start AND ? < end) OR (? > start AND ? < end)) AND class_id = ? AND day = ?";

  const checkValues = [
    req.body.start,
    req.body.start,
    req.body.end,
    req.body.end,
    req.body.class_id,
    req.body.day
  ]

  db.query(check, checkValues, (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length > 1) return res
      .status(403)
      .json(
        "The schedule for that time and day already exists. Please choose a different time or day."
      );

    const scheduleId = req.params.id;
    const q =
      "UPDATE schedules SET day = ?, start = ?, end = ?, subject_id = ?, class_id = ?, teacher_id = ? WHERE schedule_id= ?";

    const values = [
      req.body.day,
      req.body.start,
      req.body.end,
      req.body.subject_id,
      req.body.class_id,
      req.body.teacher_id,
      scheduleId,
    ];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("A schedule has been updated.");
    });
  })
};
