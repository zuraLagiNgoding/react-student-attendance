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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check, ChevronsUpDown, CircleAlert, Search } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassSchema } from "@/schemas/class-schemas";
import { useNavigate } from "react-router-dom";
import { useFetch, useLastId } from "@/hooks/fetcher";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Command, CommandGroup } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { MajorsType } from "../data_jurusan/columns";

const Save = () => {
  const navigate = useNavigate();
  const { generatedId } = useLastId(
    "http://localhost:8800/backend/classes/lastId"
  );

  const { data: majors } = useFetch<MajorsType[]>(
    "http://localhost:8800/backend/majors"
  );

  const form = useForm<z.infer<typeof ClassSchema>>({
    resolver: zodResolver(ClassSchema),
    defaultValues: {
      class_id: "",
      grade: "",
      identifier: "",
      waliKelas: "",
      major_id: "",
    },
  });

  React.useEffect(() => {
    form.reset({
      class_id: generatedId,
      grade: "",
      identifier: "",
      waliKelas: "",
      major_id: "",
    });
  }, [form, generatedId]);

  const onSubmit = async (values: z.infer<typeof ClassSchema>) => {
    try {
      await axios.post(`http://localhost:8800/backend/classes/`, {
        class_id: values.class_id,
        grade: values.grade,
        identifier: values.identifier,
        waliKelas: values.waliKelas,
        major_id: majors.find(major => major.major_name == values.major_id)?.major_id,
      });
      navigate("/classes");
    } catch (error) {
      console.log(error);
    }
  };

  const [search, setSearch] = React.useState<string>("");

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
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
                name="class_id"
                render={({ field }) => (
                  <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                    <FormLabel>Class ID</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                    <FormLabel>Grade</FormLabel>
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
                        <SelectItem value="X">X</SelectItem>
                        <SelectItem value="XI">XI</SelectItem>
                        <SelectItem value="XII">XII</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="major_id"
                render={({ field }) => (
                  <FormItem className="grid max-w-sm items-center gap-1.5">
                    <FormLabel>Major</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className="w-full">
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? majors.find(
                                  (major) => major.major_name === field.value
                                )?.major_name
                              : "Select Major"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="overflow-hidden p-0">
                        <Command>
                          <div className="flex items-center gap-x-2 border-b leading-none border-slate-200 bg-transparent px-3 py-1.5 transition-colors placeholder:text-slate-500 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
                            <Search size={16} className="text-primary inline" />
                            <input
                              placeholder="Search major..."
                              value={search}
                              onChange={searchHandler}
                              className="h-full placeholder:text-sm focus-visible:ring-0 focus-visible:outline-none px-2 py-1"
                            />
                          </div>
                          <CommandGroup>
                            <div className="overflow-y-auto max-h-[300px]">
                              {majors
                                .filter((filtered) =>
                                  filtered.major_name
                                    .toLowerCase()
                                    .includes(search.toLowerCase())
                                )
                                .map((major) => (
                                  <div
                                    className="flex hover:bg-primary/[0.08] cursor-pointer items-center px-2 py-1.5 text-sm gap-2 indent-0"
                                    onClick={() => {
                                      form.setValue("major_id", major.major_name);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "max-h-4 max-w-4 text-primary basis-1/6",
                                        field.value === major.major_name
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    <h1 className="basis-5/6 leading-tight">
                                      {major.major_name}
                                    </h1>
                                  </div>
                                ))}
                            </div>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                    <FormLabel className="flex items-center justify-between">
                      Class Identifier
                      <HoverCard>
                        <HoverCardTrigger>
                          <CircleAlert size={16} />
                        </HoverCardTrigger>
                        <HoverCardContent
                          side="left"
                          className="text-[0.8rem] text-slate-500 dark:text-slate-400 w-fit"
                        >
                          Example: X TKdP <u>2</u>
                        </HoverCardContent>
                      </HoverCard>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="waliKelas"
                render={({ field }) => (
                  <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                    <FormLabel className="flex gap-2">
                      Wali Kelas{" "}
                      <span className="text-xs text-slate-500 dark:text-slate-400 w-fit">
                        *Optional
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
