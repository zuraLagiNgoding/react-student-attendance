import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import img from "@/assets/auth.svg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    try {
      login({
        username: values.username,
        email: values.email,
        password: values.password,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen max-h-screen w-full flex md:flex-row flex-col md:justify-start justify-between overflow-hidden">
      <div className="relative 2xl:basis-[68%] md:basis-3/5 md:p-14 md:gap-0 gap-[50%] flex flex-col justify-between">
        <h1 className="text-primary text-2xl">Presynce</h1>
        <div className="items-center justify-center md:flex hidden">
          <img
            src={img}
            className="2xl:w-[calc(100vh*0.85)] w-[calc(100vh*0.60)]"
          />
        </div>
        <h1 className="text-slate-800 font-semibold 2xl:text-6xl md:text-5xl text-3xl">
          Effortless <span className="text-primary">Student</span> and{" "}
          <span className="text-primary">Attendance</span> Management.
        </h1>
      </div>
      <div className="2xl:basis-[32%] md:basis-2/5 w-full flex flex-col 2xl:px-24 md:py-14 md:gap-[35%] gap-5 border-l">
        <div className="flex flex-col md:gap-3 gap-2">
          <h1 className="md:text-4xl text-xl font-medium text-primary">
            Login
          </h1>
          <h1 className="md:text-lg text-sm text-slate-800">
            Welcome back! Input your account credentials to continue.
          </h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col md:gap-6 gap-3"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="flex flex-col md:gap-2 gap-0.5">
                  <div className="flex items-center justify-between">
                    <FormLabel>Username</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input className="border-slate-800/30" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <FormLabel>Email</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input className="border-slate-800/30" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      className="border-slate-800/30"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="py-5">Login</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
