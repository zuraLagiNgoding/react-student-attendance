import axios, { AxiosError } from "axios";
import { createContext, useEffect, useState } from "react";
import { z } from "zod";
import { LoginSchema } from "@/schemas/auth";
import toast from "react-hot-toast";

interface currentUserType {
  id: string;
  role: "ADMIN" | "STAFF" | "TEACHER" | "STUDENT";
  username: string;
  email: string;
  img?: string;
}

interface AuthContextType {
  currentUser: currentUserType | null;
  login: (inputs: z.infer<typeof LoginSchema>) => Promise<number | void> | void;
  logout: () => void
}

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => {},
  logout: () => {},
});

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<currentUserType | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const login = async (inputs: z.infer<typeof LoginSchema>) => {
    try {
      const res = await axios.post(
        "http://localhost:8800/backend/auth/login",
        inputs,
        { withCredentials: true }
      );
      setCurrentUser(res.data);
      return res.status
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response && error.response.status === 404) {
          toast.error("User credentials not found!");
        } else if (error.response && error.response.status === 400) {
          toast.error("Wrong password!");
        } else {
          toast.error(error.message);
        }
      }
    }
  };
  
  const logout = async () => {
    await axios.post(
      "http://localhost:8800/backend/auth/logout"
    );
    setCurrentUser(null);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
