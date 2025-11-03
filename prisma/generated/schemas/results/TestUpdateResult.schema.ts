import { z } from 'zod';
export const TestUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string()
}));