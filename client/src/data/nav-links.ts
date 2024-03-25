import { PanelsLeftBottom, School, Users, CalendarClock } from "lucide-react";

export const NavLinks = {
  ADMIN: {
    links: [
      {
        base: "Main Menu",
        links: [
          {
            label: "Overview",
            href: "overview",
            icon: PanelsLeftBottom
          }
        ]
      },
      {
        base: "Master Data",
        links: [
          {
            label: "Data Jurusan",
            href: "majors",
            icon: School
          },
          {
            label: "Data Kelas",
            href: "classes",
            icon: School
          },
          {
            label: "Data Siswa",
            href: "students",
            icon: Users
          },     
          {
            label: "Data Guru",
            href: "teachers",
            icon: Users
          },     
          {
            label: "Data Jadwal",
            href: "siswa",
            icon: CalendarClock
          },     
        ]
      }
    ]
  }
}