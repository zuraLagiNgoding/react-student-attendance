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
                <div className="flex flex-col gap-1">
                  <h1 className="text-lg font-medium text-wrap leading-tight">
                    {student.student_name}
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
                  <span className="text-sm font-light">
                    {student.student_name}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Class</Label>
                  {student.class_id ? (
                    <span className="text-sm font-light">{`${student.grade} ${student.shorten} ${student.identifier}`}</span>
                  ) : null}
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Gender</Label>
                  <span className="text-sm font-light">{student.gender}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Address</Label>
                  <span className="text-sm font-light">{student.address}</span>
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
