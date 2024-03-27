import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import img from "@/assets/auth.svg";

const Login = () => {
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
        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label>Username</Label>
            <Input />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Password</Label>
            <Input type="password" />
          </div>
          <Button className="py-5">Login</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
