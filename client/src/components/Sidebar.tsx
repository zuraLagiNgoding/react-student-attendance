import { NavLinks } from "@/data/nav-links";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import React, { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, MoreHorizontal, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "./ui/button";

type roleType = "ADMIN" | "TEACHER" | "STUDENT" | "UNNASSIGNED";

const Sidebar = () => {
  const [ close, setClose ] = React.useState(true); 
  const { currentUser, logout } = useContext(AuthContext);
  const role: roleType = currentUser?.role || "UNNASSIGNED";
  const navRef = React.useRef<HTMLInputElement>(null);
  const { links } = NavLinks[role];
  const location = useLocation();

  // React.useEffect(() => {
  //   const handleClickOutside = (event: Event) => {
  //     if (
  //       navRef.current &&
  //       !navRef.current.contains(event.target as Node)
  //     ) {
  //       setClose(true);
  //     } else {
  //       setClose(false)
  //     }
  //   };

  //   document.addEventListener("click", handleClickOutside, true);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside, true);
  //   };
  // });

  return (
    <aside
      ref={navRef}
      className={clsx(
        "2xl:basis-1/6 z-10 sm:basis-1/5 bg-white sm:overflow-visible overflow-hidden text-nowrap sm:w-full w-2/3 h-screen flex flex-col py-8 px-3 border-r shadow-2xl sm:relative fixed transition-all",
        close && "w-[4.8rem]"
      )}
    >
      <div className={clsx("flex justify-between items-center", close && "!justify-start")}>
        <h1
          className={clsx(
            "text-primary text-lg my-4 transition-all sm:opacity-100",
            close && "opacity-0 w-0"
          )}
        >
          Presynce
        </h1>
        {close ? (
          <PanelLeftOpen
            size={20}
            className="cursor-pointer sm:hidden block min-w-[18px] mx-auto z-10"
            onClick={() => setClose(false)}
          />
        ) : (
          <PanelLeftClose
            size={20}
            className="cursor-pointer sm:hidden block min-w-[18px]"
            onClick={() => setClose(true)}
          />
        )}
      </div>
      <div className="py-4">
        {links.map((base) => (
          <React.Fragment key={base.base}>
            <h1
              className={clsx(
                "2xl:text-xs text-[12px] font-light opacity-65 transition-all sm:opacity-100",
                close && "!opacity-0"
              )}
            >
              {base.base}
            </h1>
            <ul className="flex flex-col py-2 space-y-1.5 overflow-y-auto overflow-x-hidden">
              {base.links.map((link) => (
                <li key={link.label}>
                  <Link
                    onClick={() => setClose(false)}
                    to={link.href}
                    className={clsx(
                      "rounded-md text-sm font-medium text-slate-800 px-4 py-3 inline-flex gap-2 items-center leading-none w-full",
                      location.pathname == "/" + link.href
                        ? "bg-primary/[0.10] !text-primary/100"
                        : "hover:bg-primary/[0.08]"
                    )}
                  >
                    <link.icon size={18} className="min-w-[18px]" />
                    <span
                      className={clsx("transition-all sm:opacity-100", close && "opacity-0")}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </div>
      <div className="w-full flex gap-4 ml-1.5 justify-start items-center mt-auto">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className={clsx("sm:max-w-[70%] max-w-[50%] sm:opacity-100", close && "opacity-0")}>
          <h1 className="font-medium sm:text-sm text-xs overflow-hidden text-ellipsis">
            @{currentUser?.username}
          </h1>
          <p className="text-[10px]">{currentUser?.email}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 ml-auto">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem
              onClick={logout}
              className="flex items-center gap-2 cursor-pointer"
            >
              <LogOut size={12} />
              Logout
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};

export default Sidebar;
