import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeacherSchema } from "@/schemas/teacher-schemas";
import { Textarea } from "@/components/ui/textarea";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Save = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const form = useForm<z.infer<typeof TeacherSchema>>({
    resolver: zodResolver(TeacherSchema),
    defaultValues: {
      role: "TEACHER",
      nip: "",
      teacher_name: "",
      address: "",
      phone_number: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof TeacherSchema>) => {
    try {
      await axios.post(`http://localhost:8800/backend/teachers/`, {
        role: values.role,
        nip: values.nip,
        teacher_name: values.teacher_name,
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
    <div className="flex flex-col gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="text-3xl font-bold leading-none text-neutral-900">
        Save New Teacher Data
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="py-8">
            <CardContent className="space-y-2">
              {currentUser?.role === "ADMIN" &&
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-2 min-h-[2.5rem]"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="TEACHER" />
                            </FormControl>
                            <FormLabel className="font-medium">
                              Teacher
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="STAFF" />
                            </FormControl>
                            <FormLabel className="font-medium">
                              Staff
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              }
              <div className="grid grid-cols-2">
                <FormField
                  control={form.control}
                  name="nip"
                  render={({ field }) => (
                    <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                      <FormLabel>NIP</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          maxLength={18}
                          onKeyDown={(e) => {
                            if (
                              !/^[0-9]$/.test(e.key) &&
                              e.keyCode !== 8 &&
                              e.keyCode !== 13 &&
                              e.keyCode !== 37 &&
                              e.keyCode !== 39 
                            ) {
                              e.preventDefault();
                            }
                          }}
                          {...field}
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
                    <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
                            <div className="grid grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                      <FormLabel className="flex gap-2">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="grid w-full max-w-sm h-fit items-center gap-1.5">
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="LK">Male</SelectItem>
                          <SelectItem value="PR">Female</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Submit</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default Save;
