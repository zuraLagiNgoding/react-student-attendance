import { z } from "zod";

const phoneNumberRegex =
  /^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/;

export const TeacherSchema = z.object({
  nip: z
    .string()
    .min(1, { message: "NISN is required." })
    .max(10, { message: "NISN not be longer than 18 characters." }),
  teacher_name: z
    .string()
    .min(1, { message: "Teacher's name is required." })
    .max(100, { message: "Maximum 100 characters." }),
  gender: z.enum(["LK", "PR"]),
  address: z.string().min(1, { message: "Teacher's address is required." }),
  phone_number: z
    .string()
    .min(1, "Phone number is requred!")
    .refine((value) => phoneNumberRegex.test(value), {
      message: "Please input a valid phone number!",
    }),
  email: z.string().max(100, "Maximum 100 characters").email().optional(),
});
