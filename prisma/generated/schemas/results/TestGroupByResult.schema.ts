import { z } from 'zod';
export const TestGroupByResultSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  _count: z.object({
    id: z.number(),
    name: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable()
  }).nullable().optional()
}));