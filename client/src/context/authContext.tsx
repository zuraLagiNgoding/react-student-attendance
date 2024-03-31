import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { z } from "zod";
import { LoginSchema } from "@/schemas/auth";

interface currentUserType {
  id: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  username: string;
  email: string;
  img?: string;
}

interface AuthContextType {
  currentUser: currentUserType | null;
  login: (inputs: z.infer<typeof LoginSchema>) => void;
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
    const res = await axios.post(
      "http://localhost:8800/backend/auth/login",
      inputs
    );
    setCurrentUser(res.data);
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
