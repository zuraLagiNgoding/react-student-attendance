import { PanelsLeftBottom, School, Users, CalendarClock, NotebookPen, Album, Clipboard, Clock, } from "lucide-react";

export const NavLinks = {
  ADMIN: {
    links: [
      {
        base: "Main Menu",
        links: [
          {
            label: "Overview",
            href: "overview",
            icon: PanelsLeftBottom,
          },
          {
            label: "Record Absen",
            href: "attendance/records",
            icon: Clipboard,
          },
        ],
      },
      {
        base: "Master Data",
        links: [
          {
            label: "Data Jurusan",
            href: "majors",
            icon: Album,
          },
          {
            label: "Data Kelas",
            href: "classes",
            icon: School,
          },
          {
            label: "Data Ruang Ajar",
            href: "classrooms",
            icon: School,
          },
          {
            label: "Data Siswa",
            href: "students",
            icon: Users,
          },
          {
            label: "Data Guru",
            href: "teachers",
            icon: Users,
          },
          {
            label: "Data Mata Pelajaran",
            href: "subjects",
            icon: NotebookPen,
          },
          {
            label: "Data Jadwal",
            href: "schedules",
            icon: CalendarClock,
          },
        ],
      },
    ],
  },
  TEACHER: {
    links: [
      {
        base: "Main Menu",
        links: [
          {
            label: "Overview",
            href: "overview",
            icon: PanelsLeftBottom,
          },
          {
            label: "Jadwal Mengajar",
            href: "schedule",
            icon: Clock,
          },
          {
            label: "Presensi",
            href: "attendance",
            icon: NotebookPen,
          },
          {
            label: "Record Absen",
            href: "attendance/records",
            icon: Clipboard,
          },
        ],
      },
    ],
  },
  STUDENT: {
    links: [
      {
        base: "Main Menu",
        links: [
          {
            label: "Overview",
            href: "overview",
            icon: PanelsLeftBottom,
          },
          {
            label: "Jadwal Kelas",
            href: "schedule",
            icon: Clock,
          },
        ],
      },
    ],
  },
  UNNASSIGNED: {
    links: [
      {
        base: "",
        links: [],
      },
    ],
  },
};
