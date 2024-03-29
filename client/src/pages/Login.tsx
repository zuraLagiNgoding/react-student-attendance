import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import img from "@/assets/auth.svg";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext";

const Login = () => {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    try {
      login({
        username: values.username,
        email: values.email,
        password: values.password,
      });
      navigate("/");
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="h-screen max-h-screen w-full flex overflow-hidden">
      <div className="relative 2xl:basis-[68%] basis-3/5 p-14 flex flex-col justify-between">
        <h1 className="text-primary text-2xl">Presynce</h1>
        <div className="flex items-center justify-center">
          <img
            src={img}
            className="2xl:w-[calc(100vh*0.85)] w-[calc(100vh*0.60)]"
          />
        </div>
        <h1 className="text-slate-800 font-semibold 2xl:text-6xl text-5xl">
          Effortless <span className="text-primary">Student</span> and{" "}
          <span className="text-primary">Attendance</span> Management.
        </h1>
      </div>
      <div className="2xl:basis-[32%] basis-2/5 w-full flex flex-col 2xl:px-24 px-12 py-14 gap-[35%] border-l">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-medium text-primary">Login</h1>
          <h1 className="text-lg text-slate-800">
            Welcome back! Input your account credentials to continue.
          </h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
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
