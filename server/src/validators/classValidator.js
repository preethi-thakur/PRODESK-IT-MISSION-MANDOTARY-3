import { z } from 'zod';

export const createClassSchema = z.object({
  className: z.string().min(1).max(100),
  instructor: z.string().min(1).max(100),
  capacity: z.number().int().positive().max(1000),
  scheduledAt: z.string().datetime(),
});

export const updateClassSchema = z.object({
  className: z.string().min(1).max(100).optional(),
  instructor: z.string().min(1).max(100).optional(),
  capacity: z.number().int().positive().max(1000).optional(),
  scheduledAt: z.string().datetime().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export const classIdSchema = z.object({
  id: z.string().uuid(),
});
