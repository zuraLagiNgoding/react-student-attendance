import React from "react";
import List from "./components/List";
import Detail from "./components/Detail";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFetch } from "@/hooks/fetcher";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
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
  const { data, reFetch } = useFetch<StudentType[]>("http://localhost:8800/backend/students");
  const [student, setStudent] = React.useState<StudentType>();
  const [select, setSelect] = React.useState<number>();

  const navigate = useNavigate();
  const query = useLocation().search;

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:8800/backend/students/" + query);
      reFetch();
      navigate("/students");
      setSelect(undefined);
      setStudent(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
          <List select={select} setSelect={setSelect} students={data} setStudent={setStudent} />
          <Detail student={student} />
        </div>
      {query.includes("?delete") ? (
        <Dialog defaultOpen onOpenChange={() => navigate("/students")}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete student information</DialogTitle>
              <DialogDescription>
                You are about to delete this student information
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleDelete} type="submit">
                  Ok
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
      </div>
    </>
  );
};

export default DataGuru;
