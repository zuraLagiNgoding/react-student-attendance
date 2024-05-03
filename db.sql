CREATE DATABASE  IF NOT EXISTS `db_absensi_siswa` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db_absensi_siswa`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: db_absensi_siswa
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendance_list`
--

DROP TABLE IF EXISTS `attendance_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_list` (
  `attendance_list_id` varchar(10) NOT NULL,
  `schedule_id` varchar(10) NOT NULL,
  `created_at` datetime NOT NULL,
  `status` enum('done','incomplete') NOT NULL,
  PRIMARY KEY (`attendance_list_id`),
  KEY `attendance_schedule_id_idx` (`schedule_id`),
  CONSTRAINT `attendance_schedule_id` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`schedule_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_list`
--

LOCK TABLES `attendance_list` WRITE;
/*!40000 ALTER TABLE `attendance_list` DISABLE KEYS */;
INSERT INTO `attendance_list` VALUES ('001-01','001','2024-04-22 00:00:00','done'),('003-01','003','2024-04-22 00:00:00','done');
/*!40000 ALTER TABLE `attendance_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendances`
--

DROP TABLE IF EXISTS `attendances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendances` (
  `attendance_id` varchar(25) NOT NULL,
  `student_id` varchar(10) NOT NULL,
  `status` enum('Hadir','Sakit','Izin','Alfa') DEFAULT NULL,
  `description` varchar(225) DEFAULT NULL,
  `attendance_list_id` varchar(10) NOT NULL,
  PRIMARY KEY (`attendance_id`),
  KEY `studentId_idx` (`student_id`) /*!80000 INVISIBLE */,
  KEY `attendance_list_id_idx` (`attendance_list_id`),
  CONSTRAINT `attendance_list_id` FOREIGN KEY (`attendance_list_id`) REFERENCES `attendance_list` (`attendance_list_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `student_attendance_id` FOREIGN KEY (`student_id`) REFERENCES `students` (`nisn`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendances`
--

LOCK TABLES `attendances` WRITE;
/*!40000 ALTER TABLE `attendances` DISABLE KEYS */;
INSERT INTO `attendances` VALUES ('1111111111-001-01','1111111111','Hadir','','001-01'),('1111111111-003-01','1111111111','Hadir','','003-01'),('1623511111-001-01','1623511111','Hadir','','001-01'),('1623511111-003-01','1623511111','Hadir','','003-01'),('1623587216-001-01','1623587216','Hadir','','001-01'),('1623587216-003-01','1623587216','Hadir','','003-01'),('2222222222-001-01','2222222222','Hadir','','001-01'),('2222222222-003-01','2222222222','Hadir','','003-01'),('3333333333-001-01','3333333333','Hadir','','001-01'),('3333333333-003-01','3333333333','Hadir','','003-01'),('4444444444-001-01','4444444444','Izin','izin pulang kampung','001-01'),('4444444444-003-01','4444444444','Sakit','','003-01');
/*!40000 ALTER TABLE `attendances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classes` (
  `class_id` varchar(10) NOT NULL,
  `grade` varchar(5) NOT NULL,
  `identifier` varchar(2) NOT NULL,
  `waliKelas` varchar(225) DEFAULT NULL,
  `major_id` varchar(10) NOT NULL,
  PRIMARY KEY (`class_id`),
  KEY `majorId_idx` (`major_id`) /*!80000 INVISIBLE */,
  CONSTRAINT `majorId` FOREIGN KEY (`major_id`) REFERENCES `majors` (`major_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
INSERT INTO `classes` VALUES ('001','X','1','098765432112345678','001'),('002','X','1','','002');
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classrooms`
--

DROP TABLE IF EXISTS `classrooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classrooms` (
  `classroom_id` int NOT NULL AUTO_INCREMENT,
  `classroom_name` varchar(100) NOT NULL,
  PRIMARY KEY (`classroom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classrooms`
--

LOCK TABLES `classrooms` WRITE;
/*!40000 ALTER TABLE `classrooms` DISABLE KEYS */;
INSERT INTO `classrooms` VALUES (1,'LAB A'),(2,'RUANG 31');
/*!40000 ALTER TABLE `classrooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `majors`
--

DROP TABLE IF EXISTS `majors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `majors` (
  `major_id` varchar(10) NOT NULL,
  `major_name` varchar(50) NOT NULL,
  `shorten` varchar(10) NOT NULL,
  PRIMARY KEY (`major_id`),
  UNIQUE KEY `name_UNIQUE` (`major_name`),
  UNIQUE KEY `shorten_UNIQUE` (`shorten`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `majors`
--

LOCK TABLES `majors` WRITE;
/*!40000 ALTER TABLE `majors` DISABLE KEYS */;
INSERT INTO `majors` VALUES ('001','Rekayasa Perangkat Lunak','RPL'),('002','Geomatika','GEO');
/*!40000 ALTER TABLE `majors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `subject` varchar(225) DEFAULT NULL,
  `message` text,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message_read` enum('0','1') NOT NULL,
  `send_at` varchar(45) NOT NULL,
  `img` varchar(225) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`message_id`),
  KEY `sender_id_idx` (`sender_id`),
  KEY `receiver_id_idx` (`receiver_id`),
  CONSTRAINT `receiver_id` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sender_id` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (61,'Absence request : Izin','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet laoreet tortor. Maecenas volutpat ante ac augue maximus dapibus. Integer a diam at nulla tincidunt faucibus non sed nunc. Praesent ut urna ante. Curabitur porttitor quam ut nisl sollicitudin tincidunt. Integer elementum velit sit amet lorem euismod pharetra. Duis mollis interdum tortor, id auctor nisl fermentum ac.\n\nEtiam orci metus, imperdiet vitae ante ac, efficitur eleifend orci. Duis sit amet pulvinar ipsum. Quisque est neque, convallis sed lobortis a, eleifend nec diam. Suspendisse ac sollicitudin neque, eu auctor massa. Vestibulum at lobortis dui. Etiam ante nunc, dapibus eu sodales mollis, luctus quis nisl. Donec vitae massa tincidunt, porttitor purus vitae, iaculis massa. Phasellus ut ante a libero euismod bibendum. Duis risus enim, vulputate sit amet pharetra a, gravida a nulla. Aenean blandit, mi sed lobortis fringilla, tellus metus ornare ligula, ut iaculis ex orci nec nulla. Pellentesque in sapien eget nisl hendrerit tincidunt. Phasellus in vehicula nisl. Donec ac sodales leo.',9,15,'1','2024-04-23 09:49:28.107','1714051515620mount.png','2024-04-23','2024-04-25'),(63,'Absence request : Izin','',13,15,'1','2024-04-23 10:29:05.168',NULL,'2024-04-23','2024-04-29'),(64,'Absence request : Sakit','Izin Sakit....',9,15,'1','2024-04-26 08:18:37.727','1714094317680cover-tanjung-lesung-home2-1.jpg','2024-04-25',NULL);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedules` (
  `schedule_id` varchar(10) NOT NULL,
  `day` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `start` varchar(10) NOT NULL,
  `end` varchar(10) NOT NULL,
  `subject_id` varchar(10) NOT NULL,
  `teacher_id` varchar(18) NOT NULL,
  `class_id` varchar(10) NOT NULL,
  `classroom_id` int NOT NULL,
  PRIMARY KEY (`schedule_id`),
  KEY `subjectId_idx` (`subject_id`),
  KEY `teacherId_idx` (`teacher_id`),
  KEY `classId_idx` (`class_id`),
  KEY `classroomId_idx` (`classroom_id`),
  CONSTRAINT `classroomId` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms` (`classroom_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_schedule_class_id` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subjectId` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teacherId` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`nip`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
INSERT INTO `schedules` VALUES ('001','Monday','07:15','10:15','007','098765432112345678','001',1),('002','Monday','10:15','12:00','004','123456789012345678','001',2),('003','Monday','12:00','14:40','002','098765432112345678','001',2);
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `nisn` varchar(10) NOT NULL,
  `student_name` varchar(100) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `address` varchar(225) NOT NULL,
  `class_id` varchar(10) DEFAULT NULL,
  `phoneNumber` varchar(13) NOT NULL,
  `email` varchar(45) DEFAULT NULL,
  `uid` int DEFAULT NULL,
  PRIMARY KEY (`nisn`),
  UNIQUE KEY `uid_UNIQUE` (`uid`),
  KEY `classId_idx` (`class_id`) /*!80000 INVISIBLE */,
  CONSTRAINT `classId` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES ('1111111111','Uzumaki Naruto','LK','Tangerang','001','08111111111','naruto@mail.com',9),('1623511111','Akbar Gono Gana','LK','Tangerang','001','08123325346','akbar@mail.com',8),('1623587216','Yusuf Permata','LK','Tangerang','001','086324542332','yusuf@mail.com',7),('2222222222','Ikbir Gunu Gunu','PR','Shiratal Mustaqim','001','081234567890','ikbir@mail.com',11),('3333333333','Muhammad Sumbul','LK','Mekkah','001','081234513452','sumbul@mail.com',12),('4444444444','Yaqub Qamar Ad-Din Ad-Dibiazah','LK','Mekkah','001','081234567890','yaqub@mail.com',13),('5555555555','Khalid Khasmiri','LK','Madinah','002','081234567890','khasmiri@mail.com',14);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `subject_id` varchar(3) NOT NULL,
  `subject_name` varchar(45) NOT NULL,
  `subject_code` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES ('001','Bahasa Indonesia','B.INDO'),('002','Bahasa Inggris','B.ING'),('003','Matematika','MTK'),('004','Sejarah Indonesia','SI'),('005','Pendidikan Agama Islam','PAI'),('006','Pendidikan Jasmani','Penjas'),('007','Pemrograman Mobile','Mobile'),('008','Basis Data','Basis Data'),('009','Pemrograman Desktop','DESKTOP'),('010','Pemrograman Web','WEB'),('011','Pendidikan Pancasila','PKN');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teachers` (
  `nip` varchar(18) NOT NULL,
  `teacher_name` varchar(45) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `address` varchar(225) NOT NULL,
  `phone_number` varchar(13) NOT NULL,
  `email` varchar(225) DEFAULT NULL,
  `uid` int NOT NULL,
  PRIMARY KEY (`nip`),
  UNIQUE KEY `uid_UNIQUE` (`uid`),
  CONSTRAINT `teacher_uid` FOREIGN KEY (`uid`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
INSERT INTO `teachers` VALUES ('098765432112345678','Dimas Smilikitiw','LK','Tangerang','081234567890','dimas@mail.com',15),('102938475678901234','Gilang Velg Depan','LK','tangerang','081234567890','gilang@mail.com',16),('123456789012345678','John Doe','LK','Tangerang','083234567890','john@mail.com',10);
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(45) NOT NULL,
  `username` varchar(64) NOT NULL,
  `email` varchar(225) DEFAULT NULL,
  `img` varchar(225) DEFAULT NULL,
  `password` varchar(225) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'ADMIN','admin','admin@mail.com',NULL,'$2a$10$XOM04hZvm0WAv4OrX0CtfOT1pnjMHaG/juJ/DD3vQAo.OSCHWrOJ2'),(7,'STUDENT','1623587216','yusuf@mail.com',NULL,'$2a$10$uhXv2IVJIpWY5Vt9qsaF2.nmuH5p3syMwifYi1CqvC2VZNXN.BU3K'),(8,'STUDENT','1623511111','akbar@mail.com',NULL,'$2a$10$W8RIjqf8ivXgI.twI7iayOyf5/Q3nu6Jq3vA7Aw88sJgFJS9qeoJS'),(9,'STUDENT','1111111111','naruto@mail.com',NULL,'$2a$10$gsejELNtvss/cAGiTE0ydOD.XzhIJ3gYxjhqQBf8dxD9K/vMt0d6.'),(10,'TEACHER','123456789012345678','john@mail.com',NULL,'$2a$10$mofP4qjx8Iib2J3Jgel5P.Os9lYSwSrwZJLOyxp7dAWZCWV5sEiv2'),(11,'STUDENT','2222222222','ikbir@mail.com',NULL,'$2a$10$1sKbsp0JmUOI04.hnYoxi.F6JscGD5vkuW6JjGy2IX69OXpWcZL6S'),(12,'STUDENT','3333333333','sumbul@mail.com',NULL,'$2a$10$4Tj/AFI3JrsP5YT96hCxxuPNlpPNigdEGUkGyi.pyNkdKg2eizMZ.'),(13,'STUDENT','4444444444','yaqub@mail.com',NULL,'$2a$10$wJHlLlbCElFL44V5x5AU9eMtck6RJh.A./qyP10kQSeDXPwlS7VE6'),(14,'STUDENT','5555555555','khasmiri@mail.com',NULL,'$2a$10$AIhtwtLPrSOAGVcpuWTEs.h7TjdelAxcLUp80OcMT42eB2MgKgYZW'),(15,'TEACHER','098765432112345678','dimas@mail.com',NULL,'$2a$10$Vs6X5uQcFIFkCXEoaG/OV.6YeGeymswKPFVfxS4e4wDtwAeOwz.Xu'),(16,'STAFF','102938475678901234','gilang@mail.com',NULL,'$2a$10$0NWKbaouhrV5R4hQeVVYreucXBSKa2t/X0jFYqTVPCWJyANXHMDIa');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-03  9:59:06
