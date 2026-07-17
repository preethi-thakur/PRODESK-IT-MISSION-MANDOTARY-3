import { z } from "zod";

export const sendNotificationSchema = z.object({
  waitlistId: z.string().uuid("Invalid waitlist ID"),
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(500, "Message must be less than 500 characters")
    .optional(),
});