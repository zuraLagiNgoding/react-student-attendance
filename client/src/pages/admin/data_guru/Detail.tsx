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
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
import { TeachersType } from "./columns";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, SquarePen } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TeacherSchema } from "@/schemas/teacher-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DetailProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const DetailGuru = ({isOpen, setIsOpen}: DetailProps) => {
  const [data, setData] = React.useState<TeachersType>();
  const [isEdit, setIsEdit] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation().pathname.split("/");
  const teacherId = location[location.length - 1];

  const form = useForm<z.infer<typeof TeacherSchema>>({
    resolver: zodResolver(TeacherSchema),
    defaultValues: {
      nip: "",
      teacher_name: "",
      address: "",
      phone_number: "",
      email: "",
    },
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/backend/teachers/${teacherId}`
        );
        setData(res.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [teacherId, data]);

  const onSubmit = async (values: z.infer<typeof TeacherSchema>) => {
    try {
      await axios.put(`http://localhost:8800/backend/teachers/` + teacherId, {
        name: values.teacher_name,
        gender: values.gender,
        address: values.address,
        phone_number: values.phone_number,
        email: values.email,
      });
      navigate("/teachers");
    } catch (error) {
      console.log(error);
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
            <SheetTitle>Teacher Detail</SheetTitle>
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
                    nip: data?.nip,
                    teacher_name: data?.teacher_name,
                    address: data?.address,
                    gender: data?.gender,                    
                    phone_number: data?.phone_number,
                    email: data?.email,
                  });
                }}
              />
            )}
          </div>
          <SheetDescription>{data?.teacher_name}</SheetDescription>
        </SheetHeader>
        {isEdit ? (
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4 py-4"
              >
                <div className="flex w-full items-center justify-center">
                  <Avatar className="w-[50%] h-auto">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <FormField
                  control={form.control}
                  name="nip"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>NISN</FormLabel>
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
                  name="teacher_name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="col-span-3 !m-0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} className="col-span-3 !m-0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="col-span-3 !m-0">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LK">Male</SelectItem>
                            <SelectItem value="PR">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <h1 className="2xl:text-xs text-[12px] font-light">Contact</h1>
                <hr />
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} className="col-span-3 !m-0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Email</FormLabel>
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
            <div className="flex w-full items-center justify-center">
              <Avatar className="w-[50%] h-auto">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id">NISN</Label>
              <Input
                id="id"
                value={data?.nip}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="siswa">Teacher Name</Label>
              <Input
                id="siswa"
                value={data?.teacher_name}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={data?.address}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                value={data?.gender}
                disabled
                className="col-span-3"
              />
            </div>
            <h1 className="2xl:text-xs text-[12px] font-light">Contact</h1>
            <hr />
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                value={data?.phone_number}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={data?.email}
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

export default DetailGuru;
