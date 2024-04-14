import { z } from "zod";

export const AttendanceSchema = z.object({
  attendance_list_id: z.string().min(1, { message: "List ID is required!" }),
  attendance: z.array(
    z.object({
      attendance_id: z.string().min(1, { message: "ID is required!" }),
      student_id: z.string().min(1, { message: "Student is required!" }),
      status: z.string().min(1, { message: "status is required!" }),
      description: z.optional(z.string().max(225, { message: "Maximum 255 characters!" })),
    })
  )
});
