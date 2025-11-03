import { z } from 'zod';
export const TestUpsertResultSchema = z.object({
  id: z.string(),
  name: z.string()
});