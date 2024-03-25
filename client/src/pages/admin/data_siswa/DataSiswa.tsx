import React from "react";
import List from "./components/List";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import Detail from "./components/Detail";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import Card from "./components/Card";
// import { Button } from '@/components/ui/button'

interface StudentType {
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
  const [select, setSelect] = React.useState<number>();
  const [student, setStudent] = React.useState<StudentType>();
  const [search, setSearch] = React.useState<string>("");
  const [selectedMajor, setSelectedMajor] = React.useState<string>("");

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

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <div className="flex flex-col gap-6 h-full w-full">
      <h1 className="text-3xl font-bold leading-none text-neutral-900">
        Data Siswa
      </h1>
      <div className="flex gap-5 h-full w-full overflow-y-hidden flex-nowrap whitespace-nowrap">
        <List selectedMajor={selectedMajor} setSelectedMajor={setSelectedMajor}>
          <div className="flex items-center gap-x-2 max-w-full rounded-md border leading-none border-slate-200 bg-transparent px-2 py-1.5 m-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
            <Search size={16} className="text-primary inline" />
            <input
              placeholder="Search by Name or NISN"
              value={search}
              onChange={searchHandler}
              className="w-full h-full placeholder:text-xs focus-visible:ring-0 focus-visible:outline-none px-2 py-0.5 focus-visible:border-b"
            />
          </div>
          {students
            .filter(
              (filtered) =>
                filtered.major?.toLowerCase().includes(selectedMajor) &&
                (filtered.name.toLowerCase().includes(search.toLowerCase()) ||
                  filtered.nisn.includes(search))
            )
            .map((student, index) => (
              <div
                onClick={() => {
                  setSelect(index);
                  setStudent(student);
                }}
                className="flex gap-3 items-center cursor-pointer hover:bg-primary/[0.08] rounded-md px-4 py-2"
              >
                <Checkbox
                  onCheckedChange={() => {
                    setSelect(index);
                    setStudent(student);
                  }}
                  checked={select == index}
                />
                <div className="flex flex-col ">
                  <h1 className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {student.name}
                  </h1>
                  <p className="text-xs font-light">{student.nisn}</p>
                </div>
                {student.classId && (
                  <Badge className="ml-auto">
                    {student.grade} {student.major} {student.class}
                  </Badge>
                )}
              </div>
            ))}
        </List>
        <Detail>
          {student ? (
            <div className="flex flex-col">
              <div className="flex items-start gap-9">
                <div className="basis-1/5 flex flex-col gap-4">
                  <Avatar className="w-48 h-48 rounded-md">
                    <AvatarImage src="https://github.com/shadcn.png" />
                  </Avatar>
                  <hr />
                  <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-medium text-wrap leading-tight">
                      {student.name}
                    </h1>
                    <p className="text-sm font-light">{student.nisn}</p>
                  </div>
                </div>
                <div className="basis-3/5 grid gap-4 py-4">
                  <div className="flex flex-col gap-1">
                    <Label>NISN</Label>
                    <span className="text-sm font-light">{student.nisn}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Full Name</Label>
                    <span className="text-sm font-light">{student.name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Class</Label>
                    <span className="text-sm font-light">{`${student.grade} ${student.major} ${student.class}`}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Gender</Label>
                    <span className="text-sm font-light">{student.gender}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Address</Label>
                    <span className="text-sm font-light">
                      {student.address}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Phone Number</Label>
                    <span className="text-sm font-light">
                      {student.phoneNumber}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Email Address</Label>
                    <span className="text-sm font-light">{student.email}</span>
                  </div>
                </div>
                <div className="basis-1/5 space-y-4 mr-10">
                  <Card title="Tidak Hadir">
                    <h1 className="text-5xl font-medium">7</h1>
                  </Card>
                  <Card title="Sakit">
                    <h1 className="text-5xl font-medium">2</h1>
                  </Card>
                  <Card title="Izin">
                    <h1 className="text-5xl font-medium">2</h1>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex text-center justify-center">
              <div className="flex flex-col items-center">
                No Data Selected...
              </div>
            </div>
          )}
        </Detail>
      </div>
    </div>
  );
};

export default DataSiswa;
