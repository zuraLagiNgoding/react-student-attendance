import { z } from "zod";

export const ClassroomSchema = z.object({
  classroom_name: z
    .string()
    .min(1, { message: "Room name is required!" })
    .max(100, { message: "Maximum 100 characters" }),
});
