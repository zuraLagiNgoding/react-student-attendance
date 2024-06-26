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
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import logo from "@/assets/logo1.svg";

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
      const res = await login({
        username: values.username,
        email: values.email,
        password: values.password,
      });
      console.log(res)
      if (res === 200) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen max-h-screen w-full flex md:flex-row flex-col md:justify-start justify-between overflow-hidden">
      <div className="relative 2xl:basis-[68%] md:basis-3/5 md:p-14 md:gap-0 gap-4 flex flex-col justify-between p-8">
        <Link to={"/"} className="flex items-center gap-3">
          <img width={48} src={logo} alt="logo" />
          <h1 className="text-primary sm:text-2xl text-xl">Presynce</h1>
        </Link>
        <div className="items-center justify-center md:flex hidden">
          <img
            src={img}
            className="2xl:w-[calc(100vh*0.85)] w-[calc(100vh*0.60)]"
          />
        </div>
        <h1 className="text-slate-800 font-semibold 2xl:text-6xl md:text-5xl sm:text-3xl text-2xl block ">
          Effortless <span className="text-primary">Student</span> and{" "}
          <span className="text-primary">Attendance</span> Management.
        </h1>
      </div>
      <div className="2xl:basis-[32%] md:basis-2/5 w-full flex flex-col 2xl:px-24 md:py-14 md:justify-between gap-5 border-l p-8 md:mb-0 mb-12">
        <div className="flex flex-col md:gap-3 gap-2">
          <h1 className="md:text-4xl text-2xl font-medium text-primary">
            Login
          </h1>
          <h1 className="text-lg text-slate-800">
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
