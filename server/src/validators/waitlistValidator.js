import { z } from 'zod';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const createWaitlistSchema = z.object({
  classId: z.string().uuid(),
  userName: z.string().min(1).max(100),
  phoneNumber: z.string().regex(phoneRegex, 'Invalid phone number format'),
});

export const updateWaitlistSchema = z.object({
  userName: z.string().min(1).max(100).optional(),
  phoneNumber: z.string().regex(phoneRegex, 'Invalid phone number format').optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled']).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export const waitlistIdSchema = z.object({
  id: z.string().uuid(),
});
