import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  return (
    <div className="h-screen max-h-screen w-full flex overflow-hidden">
      <div className="relative basis-3/5 bg-primary"></div>
      <div className="basis-2/5 flex justify-center items-center">
        <form className="flex flex-col gap-4">
          <h1 className="text-2xl font-medium">Login</h1>
          <div className="flex flex-col gap-2">
            <Label>Username</Label>
            <Input />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Password</Label>
            <Input type="password" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
