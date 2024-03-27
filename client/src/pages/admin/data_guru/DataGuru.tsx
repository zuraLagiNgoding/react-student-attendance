import React from "react";
import List from "./components/List";
import Detail from "./components/Detail";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFetch } from "@/hooks/fetcher";
// import { Button } from '@/components/ui/button'

export interface StudentType {
  nisn: string;
  student_name: string;
  class_id: string;
  grade: "X" | "XI" | "XII";
  identifier: string;
  gender: string;
  address: string;
  phoneNumber: string;
  email: string;

  major_name: string;
  shorten: string;
}

const DataGuru = () => {
  const { data } = useFetch<StudentType[]>("http://localhost:8800/backend/students");
  const [student, setStudent] = React.useState<StudentType>();

  return (
    <div className="space-y-8 h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold leading-none text-neutral-900">
          Data Guru
        </h1>
        <Button>
          <Link to="save" className="flex items-center gap-2">
            <CirclePlus size={18} />
            Add New Students
          </Link>
        </Button>
      </div>
        <div className="flex gap-5">
          <List students={data} setStudent={setStudent} />
          <Detail student={student} />
        </div>
    </div>
  );
};

export default DataGuru;
