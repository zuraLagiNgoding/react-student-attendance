import { AuthContext } from "@/context/authContext";
import { NavLinks } from "@/data/nav-links";
import clsx from "clsx";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Bell, LogOut, MoreHorizontal } from "lucide-react";

type roleType = "ADMIN" | "TEACHER" | "STUDENT" | "UNNASSIGNED";

const Navbar = () => {
  const [close, setClose] = React.useState(true);
  const { currentUser, logout } = useContext(AuthContext);
  const role: roleType = currentUser?.role || "UNNASSIGNED";
  const { links } = NavLinks[role];
  return (
    <nav className="px-6 py-5 flex items-center justify-between border-b">
      <h1 className="text-primary text-lg">Presynce</h1>
      <div className="flex items-center">
        {links.map((base) => (
          <React.Fragment key={base.base}>
            <ul className="flex gap-2">
              {base.links.map((link) => (
                <li key={link.label}>
                  <Link
                    onClick={() => setClose(false)}
                    to={"/" + link.href}
                    className={clsx(
                      "text-sm font-medium text-slate-800/50 px-2 py-3 inline-flex gap-2 items-center leading-none w-full",
                      location.pathname == "/" + link.href
                        ? "!text-primary/100"
                        : "hover:text-slate-800/80 hover:border-primary border-b-2 border-transparent"
                    )}
                  >
                    <span
                      className={clsx(
                        "transition-all sm:opacity-100",
                        close && "opacity-0"
                      )}
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
      <div className="flex gap-4 items-center">
        <Bell className="cursor-pointer mr-2" size={20} />
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div
          className={clsx(
            "sm:max-w-[70%] max-w-[50%] sm:opacity-100",
            close && "opacity-0"
          )}
        >
          <h1 className="font-medium sm:text-sm text-xs overflow-hidden text-ellipsis">
            @{currentUser?.username}
          </h1>
          <p className="text-[10px]">{currentUser?.email}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
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
    </nav>
  );
};

export default Navbar;
