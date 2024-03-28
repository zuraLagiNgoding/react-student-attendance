import React from "react";
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
import { SubjectSchema } from "@/schemas/subject-schemas";
import { useNavigate } from "react-router-dom";

const Save = () => {
  const navigate = useNavigate();
  // const [input, setInput] = React.useState("");
  const [generatedId, setGeneratedId] = React.useState("");

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
          "http://localhost:8800/backend/subjects/lastId"
        );
        setGeneratedId(
          parseInt(res.data[0].next_id).toString().padStart(3, "0")
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [generatedId]);

  
  React.useEffect(() => {
    // Generate Kode Mapel 
    // const subject_code = input
    //   .split(" ")
    //   .map((word) => word.charAt(0))
    //   .join("");
    form.reset({ subject_id: generatedId, subject_name: "", subject_code: "" });
  }, [form, generatedId]);

  const onSubmit = async (values: z.infer<typeof SubjectSchema>) => {
    try {
      await axios.post(`http://localhost:8800/backend/subjects/`, {
        id: values.subject_id,
        name: values.subject_name,
        code: values.subject_code,
      });
      navigate("/subjects");
    } catch (error) {
      console.log(error);
    }
  };

  // const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setInput(event.target.value);
  // };

  return (
    <div className="flex flex-col gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="text-3xl font-bold leading-none text-neutral-900">
        Save New Subject Data
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="py-8">
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="subject_id"
                render={({ field }) => (
                  <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                    <FormLabel>Subject ID</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                <FormLabel>Subject Name</FormLabel>
                <div className="flex items-center w-full max-w-full gap-1">
                  <FormField
                    control={form.control}
                    name="subject_name"
                    render={({ field }) => (
                      <FormControl className="basis-4/6">
                        <Input
                          {...field}
                          // onChange={(e) => {
                          //   field.onChange(e);
                          //   inputChangeHandler(e);
                          // }}
                        />
                      </FormControl>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject_code"
                    render={({ field }) => (
                      <FormControl className="basis-2/6">
                        <Input {...field} placeholder="Subject Code" />
                      </FormControl>
                    )}
                  />
                </div>
                <FormMessage />
              </FormItem>
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
