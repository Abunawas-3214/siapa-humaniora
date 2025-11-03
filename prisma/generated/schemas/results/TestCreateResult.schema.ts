import { z } from 'zod';
export const TestCreateResultSchema = z.object({
  id: z.string(),
  name: z.string()
});