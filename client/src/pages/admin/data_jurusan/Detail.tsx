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
import { MajorsType } from "./columns";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, SquarePen } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { MajorSchema } from "@/schemas/major-schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

interface DetailProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const DetailKelas = ({setIsOpen, isOpen}: DetailProps) => {
  const [isEdit, setIsEdit] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [data, setData] = React.useState<MajorsType>();
  const navigate = useNavigate();
  const location = useLocation();
  const majorId = location.pathname.split("/")[2];

  const form = useForm<z.infer<typeof MajorSchema>>({
    resolver: zodResolver(MajorSchema),
    defaultValues: {
      major_id: "",
      major_name: "",
      shorten: "",
    },
  });

  React.useEffect(() => {
    const shorten = input
      .split(" ")
      .map((word) => word.charAt(0))
      .join("");
    form.reset({
      major_id: data?.major_id,
      major_name: input,
      shorten,
    });
  }, [form, input, data ]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/backend/majors/${majorId}`
        );
        setData(res.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [majorId]);

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const onSubmit = async (values: z.infer<typeof MajorSchema>) => {
    try {
      await axios.put(`http://localhost:8800/backend/majors/` + majorId, {
        name: values.major_name,
        shorten: values.shorten,
      });
      toast.success("Data Jurusan telah di update.");
      console.log(values)
    } catch (error) {
      console.log(error);
      toast.error("Terjadi kesalahan.");
    }
  }

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
            <SheetTitle>Major Detail</SheetTitle>
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
                  setInput(data?.major_name as string);
                }}
              />
            )}
          </div>
          <SheetDescription>{data?.major_name}</SheetDescription>
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
                  name="major_id"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Major ID</FormLabel>
                      <FormControl>
                        <Input {...field} disabled className="col-span-3 !m-0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="major_name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Major Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="col-span-3 !m-0"
                          onChange={(e) => {
                            field.onChange(e);
                            inputChangeHandler(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shorten"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input {...field} className="col-span-3 !m-0" />
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
              <Label htmlFor="id">Major ID</Label>
              <Input
                id="id"
                value={data?.major_id}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="major_name">Major Name</Label>
              <Input
                id="major_name"
                value={data?.major_name}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shorten">Code</Label>
              <Input
                id="shorten"
                value={data?.shorten}
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
