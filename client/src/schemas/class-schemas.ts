import { z } from "zod";

export const ClassSchema = z.object({
  id: z.string().min(1, { message: "ID is required." }),
  grade: z
    .string()
    .min(1, { message: "Please select class major." })
    .max(5, { message: "Maximum 5 characters." }),
  class: z.coerce
    .string()
    .min(1, { message: "Class identifier is required." })
    .max(5, { message: "Maximum 5 characters." }),
  waliKelas: z.optional(z.string()),
  majorId: z.string().min(1, { message: "Please select class major" }),
});
