import { z } from 'zod';
export const TestDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string()
}));