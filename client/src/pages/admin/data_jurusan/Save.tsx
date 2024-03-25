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
import { MajorSchema } from "@/schemas/major-schemas";
import { useNavigate } from "react-router-dom";

const Save = () => {
  const navigate = useNavigate();
  const [input, setInput] = React.useState("");
  const [generatedId, setGeneratedId] = React.useState("");

  const form = useForm<z.infer<typeof MajorSchema>>({
    resolver: zodResolver(MajorSchema),
    defaultValues: {
      id: "",
      name: "",
      shorten: "",
    },
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8800/backend/majors/lastId"
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
    const shorten = input
      .split(" ")
      .map((word) => word.charAt(0))
      .join("");
    form.reset({ id: generatedId, name: input , shorten });
  }, [form, generatedId, input]);

  const onSubmit = async (values: z.infer<typeof MajorSchema>) => {
    try {
      await axios.post(`http://localhost:8800/backend/majors/`, {
        id: values.id,
        name: values.name,
        shorten: values.shorten,
      });
      navigate("/majors");
    } catch (error) {
      console.log(error);
    }
  };

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  return (
    <div className="flex flex-col gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="text-3xl font-bold leading-none text-neutral-900">
        Save New Major Data
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="py-8">
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                    <FormLabel>Major ID</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                <FormLabel>Major Name</FormLabel>
                <div className="flex items-center w-full max-w-full gap-1">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormControl className="basis-4/6">
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            inputChangeHandler(e);
                          }}
                        />
                      </FormControl>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shorten"
                    render={({ field }) => (
                      <FormControl className="basis-2/6">
                        <Input {...field} />
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
