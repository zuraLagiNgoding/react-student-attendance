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
import { SubjectsType } from "./columns";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, SquarePen } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SubjectSchema } from "@/schemas/subject-schemas";
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

const DetailKelas = ({ setIsOpen, isOpen }: DetailProps) => {
  const [data, setData] = React.useState<SubjectsType>();
  const [isEdit, setIsEdit] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation().pathname.split("/");
  const subjectId = location[location.length - 1];

  const form = useForm<z.infer<typeof SubjectSchema>>({
    resolver: zodResolver(SubjectSchema),
    defaultValues: {
      subject_id: "",
      subject_name: "",
      subject_code: "",
    },
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/backend/subjects/${subjectId}`
        );
        setData(res.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [subjectId, data]);

  const onSubmit = async (values: z.infer<typeof SubjectSchema>) => {
    try {
      await axios.put(`http://localhost:8800/backend/subjects/` + subjectId, {
        name: values.subject_name,
        code: values.subject_code,
      });
      toast.success("Data mata pelajaran telah di update.");
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
                    subject_id: data?.subject_id,
                    subject_name: data?.subject_name,
                    subject_code: data?.subject_code,
                  });
                }}
              />
            )}
          </div>
          <SheetDescription>{data?.subject_name}</SheetDescription>
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
                  name="subject_id"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Class ID</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled
                          className="col-span-3 !m-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject_name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Subject</FormLabel>
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
                <FormField
                  control={form.control}
                  name="subject_code"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Subject Code</FormLabel>
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
              <Label htmlFor="id">Subject ID</Label>
              <Input
                id="id"
                value={data?.subject_id}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject_name">Subject</Label>
              <Input
                id="subject_name"
                value={data?.subject_name}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code">Subject Code</Label>
              <Input
                id="code"
                value={data?.subject_code}
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

export default DetailKelas;
