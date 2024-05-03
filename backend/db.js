import mysql from "mysql2";
import dotenv from 'dotenv';

dotenv.config()

export const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: "db_absensi_siswa"
});