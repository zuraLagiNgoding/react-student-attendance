import { z } from "zod";

export const ClassSchema = z.object({
  class_id: z.string().min(1, { message: "ID is required." }),
  grade: z
    .string()
    .min(1, { message: "Please select class major." })
    .max(5, { message: "Maximum 5 characters." }),
  identifier: z.coerce
    .string()
    .min(1, { message: "Class identifier is required." })
    .max(5, { message: "Maximum 5 characters." }),
  waliKelas: z.optional(z.string()),
  major_id: z.string().min(1, { message: "Please select class major" }),
});
