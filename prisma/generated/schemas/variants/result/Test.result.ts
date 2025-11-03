import { z } from 'zod';

// prettier-ignore
export const TestResultSchema = z.object({
    id: z.string(),
    name: z.string()
}).strict();

export type TestResultType = z.infer<typeof TestResultSchema>;
