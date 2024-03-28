import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Breadcrumbs from "./components/ui/breadcrumbs";
import { Bell, LogOut } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
// import SearchBar from "./components/ui/search-bar";

const Layout = () => {

    const { logout } = useContext(AuthContext);

  return (
    <div className="min-w-full max-w-full flex gap-2">
      <Sidebar />
      <div className="2xl:basis-5/6 basis-4/5 p-5 flex flex-col h-screen min-h-screen max-h-screen gap-10 w-full">
        <div className="flex items-center justify-between pr-4">
          <Breadcrumbs />
          <div className="flex items-center gap-4">
            {/* <SearchBar/> */}
            <Bell size={20}/>
            <LogOut onClick={logout} size={20}/>
          </div>
        </div>
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
};

export default Layout;
