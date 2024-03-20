import { PanelsLeftBottom, School, Users } from "lucide-react";

export const NavLinks = {
  ADMIN: {
    links: [
      {
        label: "Overview",
        href: "overview",
        icon: PanelsLeftBottom
      },
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
}