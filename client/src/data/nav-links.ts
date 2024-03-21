import { PanelsLeftBottom, School, Users } from "lucide-react";

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
            label: "Data Kelas",
            href: "classes",
            icon: School
          },
          {
            label: "Data Siswa",
            href: "siswa",
            icon: Users
          },     
        ]
      }
    ]
  }
}