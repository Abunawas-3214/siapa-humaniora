import { z } from 'zod';
export const TestFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string()
}));