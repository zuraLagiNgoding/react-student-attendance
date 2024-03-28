import { z } from "zod";

export const LoginSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Please enter your username." })
    .max(64, { message: "Username must not be longer than 64 characters." }),
  email: z.string().email({message: "Please enter valid email."}),
  password: z.string().min(1, { message: "Password is required."})
});
