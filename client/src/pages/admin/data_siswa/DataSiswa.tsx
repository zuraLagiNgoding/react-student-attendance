import React from "react";
import List from "./components/List";
import axios from "axios";
import Detail from "./components/Detail";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
// import { Button } from '@/components/ui/button'

export interface StudentType {
  nisn: string;
  name: string;
  classId: string;
  grade: "X" | "XI" | "XII";
  major: string;
  class: string;
  gender: string;
  address: string;
  phoneNumber: string;
  email: string;
}

const DataSiswa = () => {
  const [students, setStudents] = React.useState<StudentType[]>([]);
  const [student, setStudent] = React.useState<StudentType>();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8800/backend/students");
        setStudents(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [students]);

  // const data = [
  //   {
  //     nisn: "2170912345",
  //     name: "Maliki Azis Azyura",
  //     major: "X OT 3",
  //   },
  //   {
  //     nisn: "2170954321",
  //     name: "Muhammad Ridho",
  //     major: "X OT 3",
  //   },
  //   {
  //     nisn: "2170951243",
  //     name: "Charly Leonardo",
  //     major: "XI RPL 1",
  //   },
  //   {
  //     nisn: "1234567890",
  //     name: "Akbar Subadajo",
  //     major: "XI RPL 1",
  //   },
  //   {
  //     nisn: "1234567890",
  //     name: "Akbar Subadajo",
  //     major: "XI RPL 1",
  //   },
  //   {
  //     nisn: "1234567890",
  //     name: "Akbar Subadajo",
  //     major: "XI RPL 1",
  //   },
  //   {
  //     nisn: "1234567890",
  //     name: "Akbar Subadajo",
  //     major: "XI RPL 1",
  //   },
  //   {
  //     nisn: "1234567890",
  //     name: "Akbar Subadajo",
  //     major: "XI RPL 1",
  //   },
  //   {
  //     nisn: "1234567890",
  //     name: "Akbar Subadajo",
  //     major: "XI RPL 1",
  //   },
  //   {
  //     nisn: "1234567890",
  //     name: "Akbar Subadajo",
  //     major: "XI RPL 1",
  //   },
  //   {
  //     nisn: "1234567890",
  //     name: "Akbar Subadajo",
  //     major: "XI RPL 1",
  //   },
  // ]

  return (
    <div className="flex flex-col gap-6 h-full w-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold leading-none text-neutral-900">
          Data Siswa
        </h1>
        <Button>
          <Link to="save" className="flex items-center gap-2">
            <CirclePlus size={18} />
            Add New Students
          </Link>
        </Button>
      </div>
      <div className="flex gap-5 h-full w-full overflow-y-hidden flex-nowrap whitespace-nowrap">
        <List students={students} setStudent={setStudent}/>
        <Detail student={student}/>
      </div>
    </div>
  );
};

export default DataSiswa;
