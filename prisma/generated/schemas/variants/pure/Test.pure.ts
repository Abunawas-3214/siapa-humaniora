import { z } from 'zod';

// prettier-ignore
export const TestModelSchema = z.object({
    id: z.string(),
    name: z.string()
}).strict();

export type TestModelType = z.infer<typeof TestModelSchema>;
