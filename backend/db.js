import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "anjas1234",
  database: "db_absensi_siswa"
});