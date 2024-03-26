import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ClassesType } from "./columns";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const DetailKelas = () => {
  const [data, setData] = React.useState<ClassesType>();
  const navigate = useNavigate();
  const location = useLocation();
  const classId = location.pathname.split("/")[2];

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/backend/classes/${classId}`
        );
        setData(res.data[0]);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [classId, data]);

  return (
    <Sheet defaultOpen onOpenChange={() => navigate(-1)}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Class Detail</SheetTitle>
          <SheetDescription>
            {data?.grade} {data?.shorten} {data?.identifier}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="id">Class ID</Label>
            <Input id="id" value={data?.class_id} disabled className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="waliKelas">Wali Kelas</Label>
            <Input
              id="waliKelas"
              value={data?.waliKelas}
              disabled
              className="col-span-3"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default DetailKelas;
