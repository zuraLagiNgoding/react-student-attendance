import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Information from "./Card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { StudentType } from "./../DataSiswa";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

type DetailType = {
  student: StudentType | undefined;
};

const Detail = ({ student }: DetailType) => {
  return (
    <Card className="basis-4/6 h-auto">
      <CardHeader>
        <CardTitle>Student Detail</CardTitle>
        <CardDescription>Student Detail</CardDescription>
      </CardHeader>
      <CardContent className="">
        {student ? (
          <div className="flex flex-col">
            <div className="flex items-start gap-9">
              <div className="basis-1/5 flex flex-col gap-4">
                <Avatar className="w-48 h-48 rounded-md">
                  <AvatarImage src="https://github.com/shadcn.png" />
                </Avatar>
                <hr />
                <div className="flex justify-between">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-medium text-wrap leading-tight max-w-[80%]">
                      {student.student_name}
                    </h1>
                    <p className="text-sm font-light">{student.nisn}</p>
                  </div>
                  <Link
                    className="mt-2 hover:text-slate-500 transition-colors"
                    to={"/students/?delete=" + student.nisn}
                  >
                    <Trash2 size={18} />
                  </Link>
                </div>
              </div>
              <div className="basis-3/5 grid gap-4 py-4">
                <div className="flex flex-col gap-1">
                  <Label>NISN</Label>
                  <Input
                    value={student.nisn}
                    disabled
                    className="disabled:cursor-default disabled:opacity-100 border-0 text-sm font-light"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Full Name</Label>
                  <Input
                    value={student.student_name}
                    disabled
                    className="disabled:cursor-default disabled:opacity-100 border-0 text-sm font-light"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Class</Label>
                  <Input
                    value={
                      student.class_id
                        ? `${student.grade} ${student.shorten} ${student.identifier}`
                        : ""
                    }
                    disabled
                    className="disabled:cursor-default disabled:opacity-100 border-0 text-sm font-light"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Gender</Label>
                  <Input
                    value={student.gender}
                    disabled
                    className="disabled:cursor-default disabled:opacity-100 border-0 text-sm font-light"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Address</Label>
                  <Input
                    value={student.address}
                    disabled
                    className="disabled:cursor-default disabled:opacity-100 border-0 text-sm font-light"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Phone Number</Label>
                  <Input
                    value={student.phoneNumber}
                    disabled
                    className="disabled:cursor-default disabled:opacity-100 border-0 text-sm font-light"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Email</Label>
                  <Input
                    value={student.email}
                    disabled
                    className="disabled:cursor-default disabled:opacity-100 border-0 text-sm font-light"
                  />
                </div>
              </div>
              <div className="basis-1/5 space-y-4 mr-10">
                <Information title="Tidak Hadir">
                  <h1 className="text-5xl font-medium">7</h1>
                </Information>
                <Information title="Sakit">
                  <h1 className="text-5xl font-medium">2</h1>
                </Information>
                <Information title="Izin">
                  <h1 className="text-5xl font-medium">2</h1>
                </Information>
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
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
};

export default Detail;
