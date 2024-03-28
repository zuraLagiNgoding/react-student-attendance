import { PanelsLeftBottom, School, Users, CalendarClock, NotebookPen, Album, } from "lucide-react";

export const NavLinks = [
  {
    base: "Main Menu",
    links: [
      {
        label: "Overview",
        href: "overview",
        icon: PanelsLeftBottom,
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
        href: "siswa",
        icon: CalendarClock,
      },
    ],
  },
];
