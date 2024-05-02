import React, { Dispatch, SetStateAction } from "react";
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
import { ClassRoomsType } from "./columns";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, SquarePen } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ClassroomSchema } from "@/schemas/classroom-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";

interface DetailProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const DetailRuang = ({ setIsOpen, isOpen }: DetailProps) => {
  const [data, setData] = React.useState<ClassRoomsType>();
  const [isEdit, setIsEdit] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation().pathname.split("/");
  const classroomId = location[location.length - 1];

  const form = useForm<z.infer<typeof ClassroomSchema>>({
    resolver: zodResolver(ClassroomSchema),
    defaultValues: {
      classroom_name: "",
    },
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/backend/classrooms/${classroomId}`
        );
        setData(res.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [classroomId, data]);

  const onSubmit = async (values: z.infer<typeof ClassroomSchema>) => {
    try {
      await axios.put(`http://localhost:8800/backend/classrooms/` + classroomId, {
        name: values.classroom_name,
      });
      toast.success("Data ruang ajar telah di update.");
    } catch (error) {
      toast.error("Terjadi kesalahan.");
    }
  };

  return (
    <Sheet
      defaultOpen
      onOpenChange={() => {
        navigate(-1);
        setIsEdit(!isEdit);
        setIsOpen(!isOpen);
      }}
    >
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center gap-2">
            <SheetTitle>Class Detail</SheetTitle>
            {isEdit ? (
              <Eye
                className="cursor-pointer text-primary"
                size={16}
                onClick={() => {
                  setIsEdit(false);
                }}
              />
            ) : (
              <SquarePen
                className="cursor-pointer text-primary"
                size={16}
                onClick={() => {
                  setIsEdit(true);
                  form.reset({
                    classroom_name: data?.classroom_name,
                  });
                }}
              />
            )}
          </div>
          <SheetDescription>{data?.classroom_name}</SheetDescription>
        </SheetHeader>
        {isEdit ? (
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4 py-4"
              >
                <FormField
                  control={form.control}
                  name="classroom_name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Classroom</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="col-span-3 !m-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SheetFooter>
                  <SheetClose asChild>
                    <Button type="submit">Save changes</Button>
                  </SheetClose>
                </SheetFooter>
              </form>
            </Form>
          </>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id">Classroom ID</Label>
              <Input
                id="id"
                value={data?.classroom_id}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="classroom_name">Classroom</Label>
              <Input
                id="classroom_name"
                value={data?.classroom_name}
                disabled
                className="col-span-3"
              />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default DetailRuang;
