import { db } from "../db.js";
import jwt from 'jsonwebtoken';
import cron from "node-cron"

export const getAttendances = (req, res) => {
  const search = req.query.result;
  const q = "SELECT * FROM attendance_list";

  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getAttendanceList = (req, res) => {
  const scheduleId = req.params.id;
  const q = "SELECT attendance_list.attendance_list_id, attendances.student_id, students.student_name ,attendances.status, attendances.description, attendances.attendance_id FROM attendance_list LEFT JOIN attendances ON attendances.attendance_list_id = attendance_list.attendance_list_id LEFT JOIN students ON attendances.student_id = students.nisn WHERE schedule_id = ? AND created_at = curdate();";

  db.query(q, [scheduleId], (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

export const getList = (req, res) => {
  const classId = req.params.id;
  const uid = req.params.uid;
  const q =
    "SELECT a.* FROM attendance_list a LEFT JOIN schedules s ON a.schedule_id = s.schedule_id LEFT JOIN teachers t ON s.teacher_id = t.nip WHERE s.class_id = ? AND t.uid = ?";

  db.query(q, [classId, uid], (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
}

export const getRecaps = (req, res) => {
  const classId = req.params.id;
  const q =
    "SELECT students.nisn, students.student_name, attendance_list.created_at, attendances.status, schedules.day, subjects.subject_name FROM attendances LEFT JOIN students ON attendances.student_id = students.nisn LEFT JOIN attendance_list ON attendances.attendance_list_id = attendance_list.attendance_list_id LEFT JOIN schedules ON attendance_list.schedule_id = schedules.schedule_id LEFT JOIN subjects ON subjects.subject_id = schedules.subject_id";

  db.query(q, [classId], (err, data) => {
    if(err) return res.send(err);
    
    const transformedData = {};
    data.forEach(({ nisn, student_name, created_at, status, day, subject_name }) => {
      if (!transformedData[nisn]) {
        transformedData[nisn] = { nisn, student_name, attendance: [] };
      }
      transformedData[nisn].attendance.push({ created_at, status, subject_name ,day });
    });

    // Converting object to array
    const result = Object.values(transformedData);

    return res.status(200).json(result);
  })
}

export const getRecap = (req, res) => {
  const classId = req.params.id;
  const q =
    "SELECT students.nisn, students.student_name, attendance_list.created_at, attendances.status, schedules.day, subjects.subject_name FROM attendances LEFT JOIN students ON attendances.student_id = students.nisn LEFT JOIN attendance_list ON attendances.attendance_list_id = attendance_list.attendance_list_id LEFT JOIN schedules ON attendance_list.schedule_id = schedules.schedule_id LEFT JOIN subjects ON subjects.subject_id = schedules.subject_id WHERE students.class_id = ?";

  db.query(q, [classId], (err, data) => {
    if(err) return res.send(err);
    
    const transformedData = {};
    data.forEach(({ nisn, student_name, created_at, status, day, subject_name }) => {
      if (!transformedData[nisn]) {
        transformedData[nisn] = { nisn, student_name, attendance: [] };
      }
      transformedData[nisn].attendance.push({ created_at, status, subject_name ,day });
    });

    // Converting object to array
    const result = Object.values(transformedData);

    return res.status(200).json(result);
  })
}

export const getSubjects = (req, res) => {
  const classId = req.params.id;
  const q =
    "SELECT subjects.subject_code, subjects.subject_name, schedules.day FROM subjects LEFT JOIN schedules ON schedules.subject_id = subjects.subject_id WHERE schedules.class_id = ?";

  db.query(q, [classId], (err, data) => {
    if(err) return res.send(err);
    
    const transformedData = {};
    data.forEach(({ subject_code, subject_name, day }) => {
      if (!transformedData[day]) {
        transformedData[day] = { day, subjects: [] };
      }
      transformedData[day].subjects.push({ subject_code, subject_name });
    });

    // Converting object to array
    const result = Object.values(transformedData);

    return res.status(200).json(result);
  })
}

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
      if (classData.length > 0) {
        const classId = classData[0].class_id
  
        db.query(q, classId, (err, studentData) => {
          if (err) return res.send(err);
          return res.status(200).json(studentData)
        })
      }
    });
  });
};

export const getLastId = (req, res) => {
  const schedule_id = req.params.id;
  const q = `SELECT IFNULL((SELECT CASE WHEN MAX(SUBSTRING_INDEX(attendance_list_id, '-', -1) + 1) IS NULL THEN CONCAT(schedule_id, '-01') ELSE CONCAT(schedule_id, '-', LPAD(MAX(SUBSTRING_INDEX(attendance_list_id, '-', -1)) + 1, 2, '0')) END AS next_id FROM attendance_list WHERE schedule_id = ? ), CONCAT(?, '-01') ) AS next_id;`;

  db.query(q, [schedule_id, schedule_id], (err, data) => {
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

export const addAttendance = (req, res) => {
  const qCheck = "SELECT * FROM attendance_list WHERE schedule_id = ? AND created_at = curdate()"

  db.query(qCheck, [req.body.schedule_id], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length > 0)
    return res.status(409).json({ message: "Already took attendance today" });

    const qList = "INSERT INTO attendance_list(`attendance_list_id`, `schedule_id`, `status`, `created_at`) VALUES (?, curdate())";
  
    const valuesList = [
      req.body.attendance_list_id,
      req.body.schedule_id,
      "done",
    ];
  
    db.query(qList, [valuesList], (err, data) => {
      if (err) return res.status(500).json(err);
  
      const qAttendance = "INSERT INTO attendances(`attendance_id`, `student_id`, `status`, `description`, `attendance_list_id`) VALUES ?";
  
      const valueAttendance = 
        req.body.attendance.map((attendance) => [
          attendance.attendance_id,
          attendance.student_id,
          attendance.status,
          attendance.description,
          req.body.attendance_list_id,
        ]);
  
      db.query(qAttendance, [valueAttendance], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("A new attendance list has been created.");
      })
    });
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

export const updateAttendanceList = (req, res) => {
  const q = "UPDATE attendances SET status = ?, description = ? WHERE attendance_id = ?";
  const values = req.body.attendance;

  values.forEach((value) => {
    const { status, description, attendance_id } = value;
    db.query(q, [status, description, attendance_id], (err, result) => {
      if (err) {
        console.error("Error updating row:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
    });
  });

  res.json({ message: "Bulk update successful" });
};

