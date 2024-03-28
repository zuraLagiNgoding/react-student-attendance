import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { TeacherType } from "../DataGuru";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

type DetailType = {
  teacher: TeacherType | undefined;
};

const Detail = ({ teacher }: DetailType) => {
  return (
    <Card className="basis-4/6 h-auto">
      <CardHeader>
        <CardTitle>Teacher Detail</CardTitle>
        <CardDescription>Teacher Detail</CardDescription>
      </CardHeader>
      <CardContent className="">
        {teacher ? (
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
                      {teacher.teacher_name}
                    </h1>
                    <p className="text-sm font-light">{teacher.nip}</p>
                  </div>
                  <Link
                    className="mt-2 hover:text-slate-500 transition-colors"
                    to={"/teachers/?delete=" + teacher.nip}
                  >
                    <Trash2 size={18} />
                  </Link>
                </div>
              </div>
              <div className="basis-3/5 grid gap-4 py-4">
                <div className="flex flex-col gap-1">
                  <Label>NIP</Label>
                  <Input
                    value={teacher.nip}
                    disabled
                    className="disabled:cursor-default disabled:opacity-100 border-0 text-sm font-light"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Full Name</Label>
                  <Input
                    value={teacher.teacher_name}
                    disabled
                    className="disabled:cursor-default disabled:opacity-100 border-0 text-sm font-light"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Gender</Label>
                  <Input
                    value={teacher.gender}
                    disabled
                    className="disabled:cursor-default disabled:opacity-100 border-0 text-sm font-light"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Address</Label>
                  <Input
                    value={teacher.address}
                    disabled
                    className="disabled:cursor-default disabled:opacity-100 border-0 text-sm font-light"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Phone Number</Label>
                  <Input
                    value={teacher.phone_number}
                    disabled
                    className="disabled:cursor-default disabled:opacity-100 border-0 text-sm font-light"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Email</Label>
                  <Input
                    value={teacher.email}
                    disabled
                    className="disabled:cursor-default disabled:opacity-100 border-0 text-sm font-light"
                  />
                </div>
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
