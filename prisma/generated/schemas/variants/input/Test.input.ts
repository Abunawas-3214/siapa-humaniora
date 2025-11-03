import { z } from 'zod';

// prettier-ignore
export const TestInputSchema = z.object({
    id: z.string(),
    name: z.string()
}).strict();

export type TestInputType = z.infer<typeof TestInputSchema>;
